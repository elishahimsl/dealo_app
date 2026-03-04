/**
 * Gemini AI integration for DeaLo.
 * Uses Google's Gemini API (FREE tier: 15 RPM, 1500 RPD) for real product analysis.
 * Falls back to basic local analysis if Gemini is unavailable.
 */

const GEMINI_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY
  || process.env.EXPO_PUBLIC_GOOGLE_VISION_API_KEY
  || '';

const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`;

export interface GeminiProductAnalysis {
  overview: string;
  strengths: string[];
  weaknesses: string[];
  specs: { label: string; value: string }[];
  verdict: string;
  category: string;
  priceRange: { low: number | null; high: number | null; typical: number | null };
}

/**
 * Ask Gemini to analyze a product and return structured data.
 */
export async function geminiAnalyzeProduct(
  productName: string,
  category?: string,
  priceContext?: { avgPrice?: number | null; lowestPrice?: number | null }
): Promise<GeminiProductAnalysis | null> {
  if (!GEMINI_KEY) {
    console.warn('[DeaLo] Gemini: no API key configured');
    return null;
  }

  const priceInfo = priceContext?.avgPrice
    ? `Current average price found: $${priceContext.avgPrice}. Lowest found: $${priceContext.lowestPrice || 'unknown'}.`
    : '';

  const prompt = `You are a product analysis expert. Analyze this product: "${productName}"${category ? ` (category: ${category})` : ''}.
${priceInfo}

Return a JSON object (no markdown, no code fences, just raw JSON) with exactly these fields:
{
  "overview": "A 2-3 sentence factual overview of this product — what it is, who it's for, key selling points. Be specific to THIS exact product model.",
  "strengths": ["strength 1", "strength 2", "strength 3", "strength 4"],
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "specs": [{"label": "spec name", "value": "spec value"}, ...],
  "verdict": "A 1-2 sentence buying recommendation. Be honest and specific.",
  "category": "the product category (e.g., Bluetooth Speaker, Wireless Headphones, Smartphone)",
  "priceRange": {"low": number_or_null, "high": number_or_null, "typical": number_or_null}
}

Rules:
- Strengths and weaknesses should be based on real product reviews and known issues, not generic statements
- Specs should be REAL specs for this exact product (e.g., battery life, weight, dimensions, connectivity)
- priceRange should reflect typical US retail prices in USD (numbers only, no $ sign)
- If you don't know a value, use null
- Be concise but specific to this exact product`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    console.log('[DeaLo] Gemini: analyzing', productName);
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1024,
        },
      }),
      signal: controller.signal as any,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.warn('[DeaLo] Gemini HTTP', res.status, errText.slice(0, 300));
      return null;
    }

    const json: any = await res.json();
    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!text) {
      console.warn('[DeaLo] Gemini: empty response');
      return null;
    }

    // Parse JSON from response (handle potential markdown fences)
    const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const parsed = JSON.parse(cleaned);

    console.log('[DeaLo] Gemini: analysis complete for', productName);

    return {
      overview: parsed.overview || '',
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
      specs: Array.isArray(parsed.specs) ? parsed.specs : [],
      verdict: parsed.verdict || '',
      category: parsed.category || category || 'General',
      priceRange: {
        low: typeof parsed.priceRange?.low === 'number' ? parsed.priceRange.low : null,
        high: typeof parsed.priceRange?.high === 'number' ? parsed.priceRange.high : null,
        typical: typeof parsed.priceRange?.typical === 'number' ? parsed.priceRange.typical : null,
      },
    };
  } catch (e: any) {
    clearTimeout(timeout);
    console.warn('[DeaLo] Gemini error:', e?.message || e);
    return null;
  }
}

/**
 * Ask Gemini to refine/verify a product name detected by Vision API.
 * This helps turn "JBL" into "JBL Clip 5" when Vision only detects the brand.
 */
export async function geminiRefineProductName(
  detectedName: string,
  category?: string,
  additionalClues?: string[]
): Promise<string | null> {
  if (!GEMINI_KEY) return null;

  const clueText = additionalClues?.length
    ? `Additional clues from the image: ${additionalClues.join(', ')}`
    : '';

  const prompt = `A camera detected a product with these clues:
- Detected name/brand: "${detectedName}"
${category ? `- Category hint: ${category}` : ''}
${clueText}

If you can identify the EXACT product model (e.g., "JBL Clip 5" not just "JBL"), return ONLY the product name.
If you cannot determine the exact model, return ONLY the original name "${detectedName}".
Return just the product name, nothing else. No quotes, no explanation.`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 50 },
      }),
      signal: controller.signal as any,
    });
    clearTimeout(timeout);

    if (!res.ok) return null;

    const json: any = await res.json();
    const text = (json?.candidates?.[0]?.content?.parts?.[0]?.text || '').trim();

    if (text && text.length > 2 && text.length < 80) {
      console.log('[DeaLo] Gemini refined name:', detectedName, '→', text);
      return text;
    }
    return null;
  } catch {
    clearTimeout(timeout);
    return null;
  }
}
