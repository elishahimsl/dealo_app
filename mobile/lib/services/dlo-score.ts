import { supabase } from '../supabase';
import { PriceResult } from './price-search';

export interface DloScoreBreakdown {
  key: string;
  label: string;
  value: number;
  weight: number;
}

export interface DloScoreResult {
  overallScore: number;
  label: string;
  breakdown: DloScoreBreakdown[];
  rundown: string;
}

/**
 * Extract review sentiment signals from search result snippets.
 * Looks for positive/negative keywords to derive a sentiment score (0-100).
 */
function extractReviewSentiment(snippets: string[]): { score: number; positiveCount: number; negativeCount: number } {
  const positiveWords = [
    'excellent', 'amazing', 'great', 'love', 'best', 'perfect', 'fantastic',
    'awesome', 'outstanding', 'superb', 'highly rated', 'top rated', 'premium',
    'comfortable', 'durable', 'reliable', 'worth', 'recommend', 'impressive',
    'quality', 'solid', 'smooth', 'fast', 'lightweight', 'stylish', 'beautiful',
    '5 star', '4.5 star', '4 star', 'well made', 'well built', 'good value',
  ];
  const negativeWords = [
    'poor', 'bad', 'worst', 'terrible', 'awful', 'disappointing', 'cheap',
    'broke', 'broken', 'flimsy', 'defective', 'overpriced', 'waste', 'avoid',
    'returned', 'refund', 'complaint', 'problem', 'issue', 'fail', 'weak',
    '1 star', '2 star', 'not worth', 'low quality', 'falls apart',
  ];

  let positiveCount = 0;
  let negativeCount = 0;

  for (const snippet of snippets) {
    const lower = snippet.toLowerCase();
    for (const word of positiveWords) {
      if (lower.includes(word)) positiveCount++;
    }
    for (const word of negativeWords) {
      if (lower.includes(word)) negativeCount++;
    }
  }

  const total = positiveCount + negativeCount;
  if (total === 0) return { score: 72, positiveCount: 0, negativeCount: 0 };

  const ratio = positiveCount / total;
  const score = Math.round(Math.min(95, Math.max(35, 40 + ratio * 55)));
  return { score, positiveCount, negativeCount };
}

/**
 * Calculate the DLO score for a product based on real data.
 * Uses category-adaptive sub-scores from the score_profiles table.
 * Integrates review sentiment analysis from search snippets.
 */
export async function calculateDloScore(params: {
  category: string;
  priceResults: PriceResult[];
  avgPrice: number | null;
  lowestPrice: number | null;
  highestPrice: number | null;
  productName: string;
}): Promise<DloScoreResult> {
  const { category, priceResults, avgPrice, lowestPrice, highestPrice, productName } = params;

  // 1. Fetch score profile for this category
  const { data: profile } = await supabase
    .from('score_profiles')
    .select('sub_scores')
    .eq('category', category)
    .single();

  // Fallback profile if category not found
  const subScoreDefs: Record<string, { weight: number; label: string }> = profile?.sub_scores || {
    price: { weight: 0.3, label: 'Price' },
    features: { weight: 0.25, label: 'Features' },
    value: { weight: 0.2, label: 'Value' },
    durability: { weight: 0.25, label: 'Durability' },
  };

  // 2. Calculate individual sub-scores based on real data
  const pricedResults = priceResults.filter((r) => r.price !== null);
  const prices = pricedResults.map((r) => r.price!);

  // Extract review sentiment from search snippets
  const snippets = priceResults
    .map((r) => r.snippet)
    .filter((s): s is string => !!s && s.length > 10);
  const sentiment = extractReviewSentiment(snippets);

  const breakdown: DloScoreBreakdown[] = [];
  let weightedSum = 0;
  let totalWeight = 0;

  for (const [key, def] of Object.entries(subScoreDefs)) {
    let score = 70; // default

    if (key === 'price' && prices.length > 0 && lowestPrice && highestPrice) {
      // Price score: how good is the best available price?
      const bestAvailable = Math.min(...prices);
      if (avgPrice && avgPrice > 0) {
        const savingsPercent = ((avgPrice - bestAvailable) / avgPrice) * 100;
        score = Math.min(98, Math.max(40, 60 + savingsPercent));
      } else {
        score = 72;
      }
    } else if (key === 'value') {
      // Value = availability * price competitiveness
      const availableStores = pricedResults.length;
      const storeScore = Math.min(95, 50 + availableStores * 8);
      score = storeScore;
    } else if (key === 'features' || key === 'performance') {
      // Features/performance: blend snippet detail count with review sentiment
      const hasDetailedListings = priceResults.filter(
        (r) => r.snippet && r.snippet.length > 50
      ).length;
      const baseFeatureScore = Math.min(92, 60 + hasDetailedListings * 5);
      score = Math.round(baseFeatureScore * 0.6 + sentiment.score * 0.4);
    } else if (key === 'durability' || key === 'quality') {
      // Durability/quality: blend price-tier heuristic with review sentiment
      let priceBasedScore = 68;
      if (avgPrice && avgPrice > 200) priceBasedScore = 82;
      else if (avgPrice && avgPrice > 100) priceBasedScore = 76;
      else if (avgPrice && avgPrice > 50) priceBasedScore = 72;
      score = Math.round(priceBasedScore * 0.5 + sentiment.score * 0.5);
    } else if (key === 'battery') {
      // Battery: use sentiment as proxy for battery satisfaction in reviews
      score = Math.round(70 * 0.4 + sentiment.score * 0.6);
    } else if (key === 'comfort' || key === 'style' || key === 'ease_of_use') {
      // These subjective scores are driven primarily by review sentiment
      score = sentiment.score;
    } else if (key === 'brand') {
      // Brand reputation: known brands get higher scores, boosted by sentiment
      const knownBrands = ['apple', 'samsung', 'sony', 'nike', 'adidas', 'beats', 'bose', 'lg', 'google', 'microsoft', 'dell', 'hp', 'lenovo', 'jbl', 'harman', 'sennheiser', 'anker', 'skullcandy', 'logitech', 'razer', 'asus', 'acer'];
      const isKnownBrand = knownBrands.some((b) => productName.toLowerCase().includes(b));
      const brandBase = isKnownBrand ? 88 : 70;
      score = Math.round(brandBase * 0.7 + sentiment.score * 0.3);
    }

    score = Math.round(Math.min(98, Math.max(30, score)));

    breakdown.push({
      key,
      label: def.label,
      value: score,
      weight: def.weight,
    });

    weightedSum += score * def.weight;
    totalWeight += def.weight;
  }

  // 3. Calculate overall score
  const overallScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 70;

  // 4. Generate label and rundown
  const label = getScoreLabel(overallScore);
  const rundown = generateRundown(overallScore, breakdown, productName, pricedResults.length, lowestPrice, avgPrice);

  return {
    overallScore,
    label,
    breakdown,
    rundown,
  };
}

function getScoreLabel(score: number): string {
  if (score >= 90) return 'Exceptional Deal';
  if (score >= 80) return 'Strong Deal';
  if (score >= 70) return 'Good Deal';
  if (score >= 60) return 'Fair Deal';
  if (score >= 50) return 'Below Average';
  return 'Poor Deal';
}

function generateRundown(
  score: number,
  breakdown: DloScoreBreakdown[],
  productName: string,
  storeCount: number,
  lowestPrice: number | null,
  avgPrice: number | null
): string {
  const topScore = [...breakdown].sort((a, b) => b.value - a.value)[0];
  const bottomScore = [...breakdown].sort((a, b) => a.value - b.value)[0];

  let text = `The ${score} DLO score for ${productName} reflects `;

  if (topScore) {
    text += `strong ${topScore.label.toLowerCase()} (${topScore.value})`;
  }

  if (bottomScore && bottomScore.key !== topScore?.key) {
    text += `, with room for improvement in ${bottomScore.label.toLowerCase()} (${bottomScore.value})`;
  }

  text += '. ';

  if (storeCount > 0) {
    text += `Found across ${storeCount} retailer${storeCount > 1 ? 's' : ''}`;
    if (lowestPrice && avgPrice && avgPrice > lowestPrice) {
      const savings = Math.round(((avgPrice - lowestPrice) / avgPrice) * 100);
      text += `, with the best price ${savings}% below average`;
    }
    text += '.';
  }

  return text;
}
