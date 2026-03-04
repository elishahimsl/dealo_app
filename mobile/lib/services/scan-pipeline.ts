/**
 * DeaLo Universal Scan Pipeline
 * 
 * Multi-signal candidate generation → multi-query search → rerank → confidence gate
 * 
 * Instead of "one shot" detection (Vision → single name → search),
 * this extracts ALL signals from Vision API, generates 3-5 search queries,
 * fetches structured candidates via SerpApi, and reranks them using
 * token overlap with the original Vision signals.
 */

import { serpGoogleShopping, isSerpApiConfigured, ShoppingResult } from './serp-search';

// ─── Types ───────────────────────────────────────────────────────────

export interface VisionSignals {
  ocrText: string;
  ocrTokens: string[];
  webEntities: { desc: string; score: number }[];
  bestGuessLabels: string[];
  pageTitles: string[];
  logos: string[];
  labelAnnotations: string[];
  objectNames: string[];
}

export interface Candidate {
  id: string;
  title: string;
  image: string | null;
  price: number | null;
  priceRaw: string;
  merchant: string;
  url: string;
  sourceQuery: string;
  rating: number | null;
  reviewCount: number | null;
}

export interface RankedCandidate extends Candidate {
  score: number;
  scoreBreakdown: {
    textMatch: number;
    brandMatch: number;
    entityMatch: number;
    consensus: number;
    noisePenalty: number;
  };
}

export interface MatchDecision {
  mode: 'AUTO' | 'PICK';
  bestName: string;
  confidence: number;
  best: RankedCandidate | null;
  alternatives: RankedCandidate[];
  allCandidates: RankedCandidate[];
  queries: string[];
}

// ─── Tokenization ────────────────────────────────────────────────────

const STOPWORDS = new Set([
  'the', 'and', 'with', 'for', 'buy', 'shop', 'new', 'best', 'top',
  'price', 'sale', 'deal', 'free', 'shipping', 'review', 'reviews',
  'online', 'official', 'store', 'site', 'website', 'home', 'page',
  'from', 'get', 'your', 'our', 'this', 'that', 'how', 'what',
  'more', 'all', 'any', 'off', 'out', 'one', 'two', 'are', 'was',
  'has', 'have', 'had', 'been', 'will', 'can', 'not', 'its', 'you',
]);

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s.-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTokens(text: string): string[] {
  const norm = normalize(text);
  return norm
    .split(/\s+/)
    .filter((t) => t.length >= 2)
    .filter((t) => !STOPWORDS.has(t));
}

// Known brands for matching
const KNOWN_BRANDS = new Set([
  'jbl', 'sony', 'bose', 'apple', 'samsung', 'nike', 'adidas', 'beats', 'lg',
  'google', 'microsoft', 'dell', 'hp', 'lenovo', 'asus', 'acer', 'razer',
  'logitech', 'anker', 'skullcandy', 'sennheiser', 'harman', 'marshall',
  'ultimate ears', 'jabra', 'corsair', 'steelseries', 'hyperx',
  'nintendo', 'playstation', 'xbox', 'gopro', 'dji', 'canon', 'nikon',
  'dyson', 'kitchenaid', 'ninja', 'breville', 'cuisinart',
  'north face', 'patagonia', 'under armour', 'new balance', 'puma', 'reebok',
  'columbia', 'lululemon', 'ray-ban', 'oakley', 'yeti', 'hydro flask',
  'crocs', 'birkenstock', 'vans', 'converse',
]);

// Accessory/noise keywords — penalize these
const NOISE_KEYWORDS = new Set([
  'case', 'cover', 'sleeve', 'protector', 'screen', 'replacement',
  'parts', 'adapter', 'cable', 'charger', 'mount', 'strap', 'skin',
  'compatible', 'fits', 'refurbished', 'renewed', 'used', 'bundle',
  'lot', 'set of', 'pack of',
]);

// ─── A) Extract Vision Signals ───────────────────────────────────────

export function extractVisionSignals(visionResponse: any): VisionSignals {
  const first = visionResponse?.responses?.[0];
  if (!first) {
    return { ocrText: '', ocrTokens: [], webEntities: [], bestGuessLabels: [], pageTitles: [], logos: [], labelAnnotations: [], objectNames: [] };
  }

  // OCR text
  const ocrText = (first?.fullTextAnnotation?.text ?? '').trim();
  const ocrTokens = extractTokens(ocrText)
    .filter((t) => t.length >= 2)
    .filter((t) => /[a-z0-9]/i.test(t)); // must contain at least one letter or digit

  // Web entities
  const webEntities = (first?.webDetection?.webEntities ?? [])
    .filter((e: any) => e?.description)
    .map((e: any) => ({
      desc: (e.description as string).trim(),
      score: (e.score as number) || 0.5,
    }));

  // Best guess labels
  const bestGuessLabels = (first?.webDetection?.bestGuessLabels ?? [])
    .map((l: any) => (l?.label ?? '').trim())
    .filter(Boolean);

  // Page titles from pagesWithMatchingImages
  const pageTitles = (first?.webDetection?.pagesWithMatchingImages ?? [])
    .map((p: any) => (p?.pageTitle ?? '').trim())
    .filter((t: string) => t.length > 3 && t.length < 120);

  // Logos
  const logos = (first?.logoAnnotations ?? [])
    .filter((l: any) => l?.description)
    .map((l: any) => (l.description as string).trim());

  // Label annotations
  const labelAnnotations = (first?.labelAnnotations ?? [])
    .map((l: any) => (l?.description ?? '').trim())
    .filter(Boolean);

  // Object names
  const objectNames = (first?.localizedObjectAnnotations ?? [])
    .map((o: any) => (o?.name ?? '').trim())
    .filter(Boolean);

  return { ocrText, ocrTokens, webEntities, bestGuessLabels, pageTitles, logos, labelAnnotations, objectNames };
}

// ─── B) Build Queries ────────────────────────────────────────────────

export function buildQueries(signals: VisionSignals): { queries: string[]; rationale: string[] } {
  const queries: string[] = [];
  const rationale: string[] = [];
  const seen = new Set<string>();

  const addQuery = (q: string, reason: string) => {
    const norm = normalize(q);
    if (norm.length < 3 || seen.has(norm)) return;
    seen.add(norm);
    queries.push(q.trim());
    rationale.push(reason);
  };

  const brand = signals.logos[0] || '';
  const brandLower = brand.toLowerCase();

  // 1. Best guess labels (highest priority — Google's best identification)
  for (const label of signals.bestGuessLabels) {
    addQuery(label, `bestGuess: "${label}"`);
    if (brand && !label.toLowerCase().includes(brandLower)) {
      addQuery(`${brand} ${label}`, `logo+bestGuess: "${brand} ${label}"`);
    }
  }

  // 2. Brand + OCR model tokens (e.g., JBL + Clip 5)
  if (brand) {
    // Find model-like tokens from OCR (numbers, short alphanumeric strings)
    const modelTokens = signals.ocrTokens.filter((t) => {
      if (t.toLowerCase() === brandLower) return false;
      if (/\d/.test(t)) return true; // contains numbers
      if (t.length >= 3 && t.length <= 15 && /^[a-z0-9]+$/i.test(t)) return true;
      return false;
    });

    // Try combining brand with model-like OCR tokens
    if (modelTokens.length > 0) {
      // Try all 2-3 token combinations with the brand
      for (let len = 1; len <= Math.min(3, modelTokens.length); len++) {
        const combo = modelTokens.slice(0, len).join(' ');
        addQuery(`${brand} ${combo}`, `logo+ocrModel: "${brand} ${combo}"`);
      }
    }

    // Also try brand + each significant OCR line
    const ocrLines = signals.ocrText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    for (const line of ocrLines) {
      if (line.length >= 3 && line.length <= 30 && /\d/.test(line)) {
        const combined = line.toLowerCase().startsWith(brandLower) ? line : `${brand} ${line}`;
        addQuery(combined, `logo+ocrLine: "${combined}"`);
      }
    }
  }

  // 3. Web entity descriptions
  for (const we of signals.webEntities.slice(0, 3)) {
    if (we.desc.length >= 3 && !STOPWORDS.has(we.desc.toLowerCase())) {
      addQuery(we.desc, `webEntity: "${we.desc}" (score: ${we.score.toFixed(2)})`);
    }
  }

  // 4. Consensus from page titles
  const cleanedTitles = signals.pageTitles.map((t) =>
    t.replace(/<[^>]*>/g, '')
      .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
      .replace(/\s*[-|–—]\s*[^-|–—]*$/g, '')
      .replace(/\s*[-|–—]\s*[^-|–—]*$/g, '')
      .replace(/^Buy\s+/i, '').replace(/^Shop\s+/i, '')
      .replace(/\s*\(.*?\)\s*/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  ).filter((t) => t.length >= 3 && t.length <= 60);

  // Find common multi-word phrases across page titles
  if (cleanedTitles.length >= 2) {
    const phraseCount = new Map<string, number>();
    for (const title of cleanedTitles) {
      const words = title.split(/\s+/);
      for (let len = 2; len <= Math.min(5, words.length); len++) {
        for (let start = 0; start <= words.length - len; start++) {
          const phrase = words.slice(start, start + len).join(' ');
          phraseCount.set(phrase, (phraseCount.get(phrase) || 0) + 1);
        }
      }
    }
    const consensus = [...phraseCount.entries()]
      .filter(([, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1]);

    for (const [phrase, count] of consensus.slice(0, 3)) {
      addQuery(phrase, `consensus(${count}): "${phrase}"`);
    }
  }

  // 5. Fallback: brand alone (if nothing else worked)
  if (queries.length === 0 && brand) {
    addQuery(brand, `brandOnly: "${brand}"`);
  }

  // 6. Fallback: label annotations
  if (queries.length === 0) {
    for (const label of signals.labelAnnotations.slice(0, 2)) {
      if (!STOPWORDS.has(label.toLowerCase())) {
        addQuery(label, `label: "${label}"`);
      }
    }
  }

  console.log('[DeaLo] Pipeline: built', queries.length, 'queries:', queries);
  return { queries, rationale };
}

// ─── C) Fetch Candidates ─────────────────────────────────────────────

export async function fetchCandidates(queries: string[]): Promise<Candidate[]> {
  if (!isSerpApiConfigured()) {
    console.warn('[DeaLo] Pipeline: SerpApi not configured, skipping candidate fetch');
    return [];
  }

  const all: Candidate[] = [];
  const seenUrls = new Set<string>();

  // Search top queries (cap at 3 to control API usage)
  const queriesToRun = queries.slice(0, 3);

  for (const query of queriesToRun) {
    try {
      const results = await serpGoogleShopping(query);

      for (const r of results) {
        if (seenUrls.has(r.link)) continue;
        seenUrls.add(r.link);

        all.push({
          id: `serp-${all.length}`,
          title: r.title,
          image: r.imageUrl,
          price: r.price,
          priceRaw: r.priceRaw,
          merchant: r.store,
          url: r.link,
          sourceQuery: query,
          rating: r.rating,
          reviewCount: r.reviewCount,
        });
      }

      // Early stop: if we already have high-quality candidates, don't waste API calls
      if (all.length >= 15) {
        console.log('[DeaLo] Pipeline: enough candidates after', queriesToRun.indexOf(query) + 1, 'queries');
        break;
      }
    } catch (err: any) {
      console.warn('[DeaLo] Pipeline: query failed:', query, err?.message || err);
    }
  }

  console.log('[DeaLo] Pipeline: fetched', all.length, 'candidates from', queriesToRun.length, 'queries');
  return all.slice(0, 25);
}

// ─── D) Rerank Candidates ────────────────────────────────────────────

export function rerankCandidates(candidates: Candidate[], signals: VisionSignals): RankedCandidate[] {
  // Build a combined token set from all Vision signals
  const signalTokens = new Set<string>();
  for (const t of signals.ocrTokens) signalTokens.add(t.toLowerCase());
  for (const we of signals.webEntities) {
    for (const t of extractTokens(we.desc)) signalTokens.add(t);
  }
  for (const label of signals.bestGuessLabels) {
    for (const t of extractTokens(label)) signalTokens.add(t);
  }
  for (const logo of signals.logos) {
    signalTokens.add(logo.toLowerCase());
  }

  // Brand detection
  const detectedBrand = signals.logos[0]?.toLowerCase() || '';
  const webEntityBrands = signals.webEntities
    .filter((we) => KNOWN_BRANDS.has(we.desc.toLowerCase()))
    .map((we) => we.desc.toLowerCase());
  const allBrands = new Set([detectedBrand, ...webEntityBrands].filter(Boolean));

  // Count title frequency for consensus scoring
  const titleNormCounts = new Map<string, number>();
  for (const c of candidates) {
    const normTitle = normalize(c.title).replace(/\s*[-,]\s*(black|white|blue|red|green|pink|gray|grey|silver|gold).*$/i, '').trim();
    titleNormCounts.set(normTitle, (titleNormCounts.get(normTitle) || 0) + 1);
  }

  const ranked: RankedCandidate[] = candidates.map((c) => {
    const titleTokens = extractTokens(c.title);
    const titleLower = c.title.toLowerCase();

    // 1. Text match score (0–50): token overlap with Vision signals
    const matchingTokens = titleTokens.filter((t) => signalTokens.has(t));
    const textMatch = Math.min(50, (matchingTokens.length / Math.max(1, signalTokens.size)) * 80);

    // 2. Brand match score (0–20)
    let brandMatch = 0;
    for (const brand of allBrands) {
      if (titleLower.includes(brand)) {
        brandMatch = 20;
        break;
      }
    }

    // 3. Entity match score (0–15): specific web entity descriptions in title
    let entityMatch = 0;
    for (const we of signals.webEntities) {
      if (titleLower.includes(we.desc.toLowerCase())) {
        entityMatch = Math.min(15, entityMatch + we.score * 10);
      }
    }

    // 4. Consensus score (0–10): same/similar title across merchants
    const normTitle = normalize(c.title).replace(/\s*[-,]\s*(black|white|blue|red|green|pink|gray|grey|silver|gold).*$/i, '').trim();
    const titleCount = titleNormCounts.get(normTitle) || 0;
    const consensus = Math.min(10, (titleCount - 1) * 5);

    // 5. Noise penalty (0–15)
    let noisePenalty = 0;
    for (const noise of NOISE_KEYWORDS) {
      if (titleLower.includes(noise)) {
        noisePenalty += 5;
      }
    }
    noisePenalty = Math.min(15, noisePenalty);

    const score = Math.max(0, textMatch + brandMatch + entityMatch + consensus - noisePenalty);

    return {
      ...c,
      score,
      scoreBreakdown: { textMatch, brandMatch, entityMatch, consensus, noisePenalty },
    };
  });

  ranked.sort((a, b) => b.score - a.score);
  return ranked;
}

// ─── E) Confidence Gate ──────────────────────────────────────────────

export function confidenceGate(ranked: RankedCandidate[]): MatchDecision {
  if (ranked.length === 0) {
    return { mode: 'PICK', bestName: '', confidence: 0, best: null, alternatives: [], allCandidates: [], queries: [] };
  }

  const top = ranked[0];
  const gap = ranked.length > 1 ? top.score - ranked[1].score : 100;

  let mode: 'AUTO' | 'PICK';
  let confidence: number;

  if (top.score >= 75 && gap >= 8) {
    mode = 'AUTO';
    confidence = Math.min(1, top.score / 100);
  } else if (top.score >= 68 && gap >= 5) {
    mode = 'AUTO'; // Still auto-select but with lower confidence
    confidence = Math.min(0.9, top.score / 100);
  } else {
    mode = 'PICK';
    confidence = Math.min(0.7, top.score / 100);
  }

  // Extract clean product name from best candidate title
  const bestName = top.title
    .replace(/\s*[-,]\s*(Black|White|Blue|Red|Green|Pink|Gray|Grey|Silver|Gold|Purple|Orange|Yellow).*$/i, '')
    .replace(/\s*\(.*?\)/g, '')
    .trim();

  console.log('[DeaLo] Pipeline: confidence gate:', mode, '| top score:', top.score.toFixed(1), '| gap:', gap.toFixed(1), '| name:', bestName);

  return {
    mode,
    bestName,
    confidence,
    best: top,
    alternatives: ranked.slice(1, 5),
    allCandidates: ranked,
    queries: [],
  };
}

// ─── Full Pipeline ───────────────────────────────────────────────────

export async function runScanPipeline(signals: VisionSignals): Promise<MatchDecision> {
  console.log('[DeaLo] ═══ SCAN PIPELINE START ═══');
  console.log('[DeaLo] Signals:', {
    ocrTokens: signals.ocrTokens.length,
    webEntities: signals.webEntities.length,
    logos: signals.logos,
    bestGuess: signals.bestGuessLabels,
    pages: signals.pageTitles.length,
  });

  // Step 1: Build search queries from Vision signals
  const { queries, rationale } = buildQueries(signals);
  if (queries.length === 0) {
    console.warn('[DeaLo] Pipeline: no queries generated');
    return { mode: 'PICK', bestName: '', confidence: 0, best: null, alternatives: [], allCandidates: [], queries: [] };
  }

  // Step 2: Fetch candidates via SerpApi
  const candidates = await fetchCandidates(queries);
  if (candidates.length === 0) {
    console.warn('[DeaLo] Pipeline: no candidates found');
    // Fall back to best guess from Vision signals
    const fallbackName = signals.bestGuessLabels[0]
      || signals.webEntities[0]?.desc
      || (signals.logos[0] ? signals.logos[0] : '')
      || '';
    return { mode: 'PICK', bestName: fallbackName, confidence: 0.3, best: null, alternatives: [], allCandidates: [], queries };
  }

  // Step 3: Rerank candidates against Vision signals
  const ranked = rerankCandidates(candidates, signals);

  // Log top 5 for debugging
  console.log('[DeaLo] Pipeline: top candidates:');
  for (const r of ranked.slice(0, 5)) {
    console.log(`  ${r.score.toFixed(1)} | ${r.title} | ${r.merchant} | $${r.price || '?'} | breakdown:`, r.scoreBreakdown);
  }

  // Step 4: Confidence gate
  const decision = confidenceGate(ranked);
  decision.queries = queries;

  console.log('[DeaLo] ═══ SCAN PIPELINE DONE ═══', decision.mode, decision.bestName);
  return decision;
}
