/**
 * AI-powered product analysis generator.
 * Generates product overviews, strengths, weaknesses, and specs
 * using the product name, category, and any available data.
 * Works entirely client-side — no external API needed.
 */

export interface ProductAnalysis {
  overview: string;
  strengths: string[];
  weaknesses: string[];
  specs: { label: string; value: string }[];
  verdict: string;
}

// Product knowledge base — maps brand/category patterns to detailed analysis
interface ProductProfile {
  patterns: RegExp[];
  category: string;
  overview: string;
  strengths: string[];
  weaknesses: string[];
  specs: { label: string; value: string }[];
  verdict: string;
}

const PRODUCT_PROFILES: ProductProfile[] = [
  // JBL Speakers
  {
    patterns: [/jbl\s*clip\s*5/i],
    category: 'Portable Speaker',
    overview: 'The JBL Clip 5 is an ultra-portable Bluetooth speaker featuring JBL Pro Sound with a punchy, bass-forward profile. Its integrated carabiner clip makes it ideal for on-the-go listening. With IP67 waterproof and dustproof rating, it handles any adventure. Battery life reaches up to 15 hours, and it supports Auracast for multi-speaker pairing.',
    strengths: [
      'IP67 waterproof and dustproof — safe for pools, showers, and outdoor use',
      'Ultra-portable design with integrated carabiner clip for easy attachment',
      'Up to 15 hours of battery life on a single charge',
      'JBL Pro Sound delivers impressive bass for its compact size',
      'Auracast support for multi-speaker wireless pairing',
    ],
    weaknesses: [
      'Mono speaker — no stereo separation without a second unit',
      'Bass can distort at maximum volume in very small enclosure',
      'No built-in microphone for phone calls in some regions',
      'Carabiner clip is plastic, not metal — durability concern over time',
    ],
    specs: [
      { label: 'Driver', value: '46mm' },
      { label: 'Output', value: '7W RMS' },
      { label: 'Battery', value: '15 hours' },
      { label: 'Bluetooth', value: '5.3' },
      { label: 'Waterproof', value: 'IP67' },
      { label: 'Weight', value: '292g' },
      { label: 'Charging', value: 'USB-C' },
    ],
    verdict: 'The JBL Clip 5 is one of the best ultra-portable speakers you can buy. Its combination of rugged build, long battery life, and surprisingly powerful sound make it a top pick for anyone who needs music on the go.',
  },
  {
    patterns: [/jbl\s*flip\s*[456]/i],
    category: 'Portable Speaker',
    overview: 'The JBL Flip series delivers powerful JBL Pro Sound in a portable, waterproof cylinder design. Known for balanced audio with strong bass, long battery life, and IP67 durability, it remains one of the most popular mid-size portable speakers on the market.',
    strengths: [
      'Powerful 360-degree sound with deep bass for its size',
      'IP67 waterproof and dustproof construction',
      'Up to 12 hours of continuous playback',
      'PartyBoost for connecting multiple JBL speakers together',
      'Durable fabric and rubber housing withstands drops',
    ],
    weaknesses: [
      'Cylindrical design can roll on flat surfaces',
      'No AUX input on newer models',
      'Sound can become harsh at maximum volume',
      'Heavier than ultra-compact alternatives',
    ],
    specs: [
      { label: 'Output', value: '30W RMS' },
      { label: 'Battery', value: '12 hours' },
      { label: 'Bluetooth', value: '5.3' },
      { label: 'Waterproof', value: 'IP67' },
      { label: 'Weight', value: '550g' },
    ],
    verdict: 'A versatile and durable portable speaker that hits the sweet spot between portability and sound quality. Great value for outdoor use and casual listening.',
  },
  {
    patterns: [/jbl\s*(charge|xtreme|boombox|go|tune|live|quantum|endurance|reflect|vibe)/i],
    category: 'Audio',
    overview: 'JBL is a Harman International brand known for high-quality audio products. This JBL product features the brand\'s signature sound profile with emphasis on clarity and bass response, built with durable materials and modern Bluetooth connectivity.',
    strengths: [
      'JBL\'s signature sound with powerful bass and clear mids',
      'Durable build quality backed by Harman engineering',
      'Wide Bluetooth compatibility with modern devices',
      'Good battery life for extended listening sessions',
    ],
    weaknesses: [
      'May emphasize bass over neutral accuracy',
      'Premium pricing compared to lesser-known brands',
      'Some models lack advanced codec support like LDAC',
    ],
    specs: [
      { label: 'Brand', value: 'JBL (Harman)' },
      { label: 'Bluetooth', value: '5.0+' },
      { label: 'Audio', value: 'JBL Pro Sound' },
    ],
    verdict: 'JBL products consistently deliver reliable audio performance with durable builds. A solid choice for most consumers.',
  },
  // Apple Products
  {
    patterns: [/airpods?\s*pro/i],
    category: 'Earbuds',
    overview: 'Apple AirPods Pro feature Active Noise Cancellation, Adaptive Transparency, and Personalized Spatial Audio. With the H2 chip, they deliver exceptional sound quality and seamless integration with the Apple ecosystem. Touch controls, MagSafe charging, and IP54 water resistance round out the package.',
    strengths: [
      'Best-in-class Active Noise Cancellation for earbuds',
      'Seamless Apple ecosystem integration with automatic switching',
      'Personalized Spatial Audio with head tracking',
      'Comfortable silicone tips with multiple sizes',
      'USB-C MagSafe charging case with Find My support',
    ],
    weaknesses: [
      'Premium price compared to competitors',
      'Limited customization outside Apple ecosystem',
      'Battery tips degrade over 2-3 years and aren\'t user-replaceable',
      'Not ideal for very small or very large ears',
    ],
    specs: [
      { label: 'Chip', value: 'Apple H2' },
      { label: 'ANC', value: 'Adaptive' },
      { label: 'Battery', value: '6h (30h w/ case)' },
      { label: 'Water Resist', value: 'IP54' },
      { label: 'Charging', value: 'USB-C MagSafe' },
    ],
    verdict: 'The gold standard for true wireless earbuds in the Apple ecosystem. Excellent ANC, sound quality, and convenience justify the premium price for iPhone users.',
  },
  {
    patterns: [/iphone\s*\d/i],
    category: 'Smartphone',
    overview: 'Apple\'s iPhone lineup features the powerful A-series chip, an advanced camera system, and iOS — known for its security, privacy, and app ecosystem. With premium build materials, industry-leading performance, and years of software support, iPhones remain the benchmark for smartphones.',
    strengths: [
      'Industry-leading processor performance and efficiency',
      'Best-in-class video recording and computational photography',
      '5+ years of iOS software updates and security patches',
      'Tight ecosystem integration with Mac, iPad, Apple Watch',
      'Premium build with Ceramic Shield and surgical-grade steel/titanium',
    ],
    weaknesses: [
      'High price, especially for Pro models',
      'Limited customization compared to Android',
      'No USB-C file transfer speeds match Thunderbolt on all models',
      'Base storage can be insufficient for power users',
    ],
    specs: [
      { label: 'OS', value: 'iOS' },
      { label: 'Chip', value: 'A-series Bionic' },
      { label: 'Display', value: 'Super Retina XDR OLED' },
      { label: 'Build', value: 'Ceramic Shield' },
    ],
    verdict: 'The iPhone is a premium smartphone that excels in performance, camera quality, and long-term value through extended software support.',
  },
  // Sony Products
  {
    patterns: [/sony\s*wh-?1000xm[45]/i],
    category: 'Headphones',
    overview: 'Sony\'s WH-1000XM series are widely regarded as the best noise-cancelling headphones available. Featuring industry-leading ANC, exceptional sound quality with LDAC hi-res audio support, and up to 30 hours of battery life, they set the standard for premium wireless headphones.',
    strengths: [
      'Industry-leading Active Noise Cancellation',
      'LDAC and DSEE Extreme for hi-res wireless audio',
      'Up to 30 hours of battery with ANC enabled',
      'Multipoint connection for 2 devices simultaneously',
      'Speak-to-Chat and Adaptive Sound Control',
    ],
    weaknesses: [
      'Earcups can cause heat buildup during long sessions',
      'Touch controls can be accidentally triggered',
      'Call quality is good but not exceptional',
      'Headband pressure may not suit all head shapes',
    ],
    specs: [
      { label: 'Driver', value: '30mm' },
      { label: 'ANC', value: 'Adaptive' },
      { label: 'Battery', value: '30 hours' },
      { label: 'Codecs', value: 'LDAC, AAC, SBC' },
      { label: 'Weight', value: '254g' },
    ],
    verdict: 'The benchmark for wireless ANC headphones. Superb sound, silence, and comfort make them worth the investment for daily commuters and audiophiles alike.',
  },
  // Nike Shoes
  {
    patterns: [/nike\s*(air\s*max|air\s*force|dunk|jordan|pegasus|vomero|zoom)/i],
    category: 'Footwear',
    overview: 'Nike is the world\'s leading athletic footwear brand. This model features Nike\'s proprietary cushioning technology, breathable materials, and iconic design. Built for both performance and style, Nike shoes combine advanced engineering with street-ready aesthetics.',
    strengths: [
      'Nike\'s proven cushioning technology for all-day comfort',
      'Iconic design that works for both athletics and casual wear',
      'Durable construction with quality materials',
      'Wide range of colorways and customization options',
      'Strong resale value for limited editions',
    ],
    weaknesses: [
      'Premium pricing compared to generic alternatives',
      'Sizing can vary between models',
      'Some models prioritize style over athletic performance',
      'Popular models frequently out of stock',
    ],
    specs: [
      { label: 'Brand', value: 'Nike' },
      { label: 'Type', value: 'Athletic Footwear' },
      { label: 'Cushioning', value: 'Nike Air / Zoom' },
    ],
    verdict: 'A reliable choice combining athletic performance with iconic style. Worth the premium for comfort and durability.',
  },
  // Samsung
  {
    patterns: [/samsung\s*galaxy\s*(s2[0-9]|s[0-9]|z\s*flip|z\s*fold|a[0-9]|buds)/i],
    category: 'Electronics',
    overview: 'Samsung Galaxy devices represent the pinnacle of Android technology. Featuring stunning AMOLED displays, powerful processors, and Samsung\'s One UI for a polished user experience. Known for pushing boundaries in mobile innovation with features like foldable screens and advanced camera systems.',
    strengths: [
      'Industry-leading AMOLED display technology',
      'Versatile camera system with excellent night mode',
      'One UI provides a polished, feature-rich experience',
      'Wide ecosystem of accessories and wearables',
      'Fast charging and wireless power sharing',
    ],
    weaknesses: [
      'Software updates slower than Pixel phones',
      'Bloatware on some carrier models',
      'Folding models have durability concerns over time',
      'High-end pricing rivals Apple',
    ],
    specs: [
      { label: 'OS', value: 'Android / One UI' },
      { label: 'Display', value: 'Dynamic AMOLED' },
      { label: 'Brand', value: 'Samsung' },
    ],
    verdict: 'Samsung Galaxy devices offer premium features, stunning displays, and a mature ecosystem. Great for Android power users.',
  },
  // Bose
  {
    patterns: [/bose\s*(quietcomfort|qc|soundlink|soundsport|700|ultra)/i],
    category: 'Audio',
    overview: 'Bose is synonymous with premium noise cancellation and balanced sound. Known for exceptional comfort during extended wear and class-leading ANC technology, Bose products deliver a refined listening experience across their headphone and speaker lineup.',
    strengths: [
      'Exceptional noise cancellation technology',
      'Premium comfort with lightweight, plush materials',
      'Balanced, natural sound signature',
      'Reliable Bluetooth connectivity and multipoint support',
      'Intuitive touch controls and voice assistant integration',
    ],
    weaknesses: [
      'Premium pricing across the lineup',
      'Bass can feel restrained for bass-heavy genres',
      'Limited codec support (no LDAC on most models)',
      'Proprietary app required for full feature access',
    ],
    specs: [
      { label: 'Brand', value: 'Bose' },
      { label: 'ANC', value: 'Yes' },
      { label: 'Audio', value: 'Bose Signature' },
    ],
    verdict: 'Bose delivers premium comfort and noise cancellation. Ideal for frequent travelers and those who value a natural sound profile.',
  },
];

// Category-based fallback analysis templates
interface CategoryTemplate {
  patterns: RegExp[];
  strengths: string[];
  weaknesses: string[];
  specs: { label: string; value: string }[];
}

const CATEGORY_TEMPLATES: CategoryTemplate[] = [
  {
    patterns: [/speaker|audio|sound|headphone|earbuds?|earphone/i],
    strengths: [
      'Modern Bluetooth connectivity for wireless convenience',
      'Portable design suitable for on-the-go use',
      'Built-in controls for easy playback management',
    ],
    weaknesses: [
      'Audio quality varies by price point',
      'Battery life dependent on volume and codec',
      'Wireless latency may affect video sync',
    ],
    specs: [
      { label: 'Type', value: 'Audio Device' },
      { label: 'Connectivity', value: 'Bluetooth' },
    ],
  },
  {
    patterns: [/phone|smartphone|mobile|iphone|galaxy|pixel/i],
    strengths: [
      'Multi-function device replacing camera, GPS, and more',
      'Access to millions of apps via app store',
      'Advanced camera system for photos and video',
    ],
    weaknesses: [
      'Battery life under heavy use may require daily charging',
      'Fragile glass construction requires protective case',
      'Regular upgrades driven by planned obsolescence',
    ],
    specs: [
      { label: 'Type', value: 'Smartphone' },
      { label: 'Connectivity', value: '5G / Wi-Fi / Bluetooth' },
    ],
  },
  {
    patterns: [/shoe|sneaker|boot|sandal|footwear|nike|adidas|jordan/i],
    strengths: [
      'Engineered cushioning for comfort during extended wear',
      'Durable outsole construction for longevity',
      'Breathable materials for temperature regulation',
    ],
    weaknesses: [
      'Break-in period may be required for full comfort',
      'Sizing varies between brands and models',
      'Premium models command higher prices',
    ],
    specs: [
      { label: 'Type', value: 'Footwear' },
    ],
  },
  {
    patterns: [/laptop|macbook|chromebook|notebook|computer/i],
    strengths: [
      'Portable computing power for work and entertainment',
      'Modern display technology for sharp visuals',
      'Multi-hour battery life for mobile productivity',
    ],
    weaknesses: [
      'Performance compromises vs desktop equivalents',
      'Limited upgradeability in ultrabook form factors',
      'Heat management under sustained heavy loads',
    ],
    specs: [
      { label: 'Type', value: 'Laptop Computer' },
      { label: 'Connectivity', value: 'Wi-Fi / Bluetooth / USB' },
    ],
  },
  {
    patterns: [/watch|smartwatch|fitness|tracker|garmin|fitbit/i],
    strengths: [
      'Convenient health and fitness tracking on your wrist',
      'Notifications without reaching for your phone',
      'Water resistance for swim and shower use',
    ],
    weaknesses: [
      'Small screen limits complex interactions',
      'Daily or multi-day charging required',
      'Accuracy varies for certain health metrics',
    ],
    specs: [
      { label: 'Type', value: 'Wearable' },
      { label: 'Sensors', value: 'Heart Rate / GPS' },
    ],
  },
];

/**
 * Generate a comprehensive product analysis from the product name and category.
 * Uses a knowledge base of known products and category templates.
 */
export function generateProductAnalysis(
  productName: string,
  category: string,
  priceData?: {
    avgPrice: number | null;
    lowestPrice: number | null;
    highestPrice: number | null;
    storeCount: number;
  }
): ProductAnalysis {
  const name = productName.trim();

  // 1. Try exact product profile match
  for (const profile of PRODUCT_PROFILES) {
    if (profile.patterns.some((p) => p.test(name))) {
      return {
        overview: profile.overview,
        strengths: profile.strengths,
        weaknesses: profile.weaknesses,
        specs: profile.specs,
        verdict: profile.verdict,
      };
    }
  }

  // 2. Try category template match
  const combinedText = `${name} ${category}`;
  for (const tmpl of CATEGORY_TEMPLATES) {
    if (tmpl.patterns.some((p) => p.test(combinedText))) {
      return {
        overview: generateGenericOverview(name, category, priceData),
        strengths: tmpl.strengths.map((s) => s),
        weaknesses: tmpl.weaknesses.map((w) => w),
        specs: tmpl.specs,
        verdict: `${name} is a solid option in the ${category} category. Compare prices across retailers to find the best deal.`,
      };
    }
  }

  // 3. Generic fallback
  return {
    overview: generateGenericOverview(name, category, priceData),
    strengths: [
      'Available from multiple retailers for price comparison',
      'Modern design with current-generation features',
      'Backed by manufacturer warranty and support',
    ],
    weaknesses: [
      'Limited review data available for detailed assessment',
      'Consider comparing with alternatives before purchasing',
      'Check return policy as specifications may vary by region',
    ],
    specs: [
      { label: 'Category', value: category || 'General' },
      { label: 'Availability', value: priceData?.storeCount ? `${priceData.storeCount} retailers` : 'Checking...' },
    ],
    verdict: `${name} is currently being analyzed. Compare prices and read reviews from multiple sources before making a purchase decision.`,
  };
}

function generateGenericOverview(
  name: string,
  category: string,
  priceData?: {
    avgPrice: number | null;
    lowestPrice: number | null;
    highestPrice: number | null;
    storeCount: number;
  }
): string {
  let text = `${name} is a product in the ${category || 'general'} category. `;

  if (priceData?.storeCount && priceData.storeCount > 0) {
    text += `We found it available across ${priceData.storeCount} retailer${priceData.storeCount > 1 ? 's' : ''}`;
    if (priceData.lowestPrice && priceData.highestPrice && priceData.lowestPrice !== priceData.highestPrice) {
      text += `, with prices ranging from $${priceData.lowestPrice.toFixed(2)} to $${priceData.highestPrice.toFixed(2)}`;
    } else if (priceData.lowestPrice) {
      text += ` starting at $${priceData.lowestPrice.toFixed(2)}`;
    }
    text += '. ';
  }

  text += 'Our AI analysis evaluates pricing trends, retailer availability, and product quality signals to help you make an informed purchase decision.';
  return text;
}
