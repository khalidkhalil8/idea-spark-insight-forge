
import { Competitor, AnalysisResult } from "./utils.ts";

/**
 * Generates fallback competitors when API fails
 */
export function generateFallbackCompetitors(idea: string): Competitor[] {
  console.log("Generating fallback competitors for:", idea);
  
  // Extract keywords from idea to make more relevant fallbacks
  const keywords = extractKeywords(idea);
  const industry = determineIndustry(idea);
  
  const genericCompetitors: Competitor[] = [
    {
      name: `${capitalize(keywords[0] || "Market")} Leader`,
      description: `Established player in the ${industry} space with comprehensive features and strong brand recognition.`,
      website: "#"
    },
    {
      name: `${capitalize(keywords[1] || "Innovative")} Solutions`,
      description: `Growing competitor focused on ${keywords[0] || "innovative"} approaches to ${industry} challenges.`,
      website: "#"
    },
    {
      name: `${capitalize(keywords[2] || "Global")} ${capitalize(industry)}`,
      description: `Large enterprise solution targeting ${industry} professionals with extensive integrations.`,
      website: "#"
    },
    {
      name: `${capitalize(keywords[0] || "")}${capitalize(keywords[1] || "Smart")}`,
      description: `Startup focused on ${keywords[2] || "innovative"} solutions for ${industry} problems.`,
      website: "#"
    },
  ];
  
  return genericCompetitors;
}

/**
 * Generates fallback gap analysis when OpenAI API fails
 */
export function generateFallbackAnalysis(idea: string, competitors: Competitor[]): AnalysisResult {
  console.log("Generating fallback analysis for:", idea);
  
  // Extract keywords for more relevant fallbacks
  const keywords = extractKeywords(idea);
  const industry = determineIndustry(idea);
  
  return {
    competitors,
    marketGaps: [
      `Lack of affordable solutions for small businesses in the ${industry} space.`,
      `No comprehensive mobile-first approach focusing on ${keywords[0] || "user"} experience.`,
      `Insufficient integration with existing ${keywords[1] || "business"} tools and workflows.`
    ],
    positioningSuggestions: [
      `Focus on solving the specific pain point of ${keywords[0] || "users"} with an intuitive interface.`,
      `Differentiate by offering more transparent pricing compared to competitors in the ${industry} market.`,
      `Emphasize ease of integration with existing tools that ${keywords[1] || "businesses"} already use.`
    ]
  };
}

/**
 * Helper function to extract keywords from idea text
 */
function extractKeywords(text: string): string[] {
  // Remove common words and punctuation
  const cleanedText = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ');
  
  const commonWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be', 'been',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could',
    'of', 'for', 'in', 'on', 'at', 'to', 'from', 'with', 'by', 'about', 'as',
    'into', 'like', 'through', 'after', 'over', 'between', 'out', 'against', 'during',
    'without', 'before', 'under', 'around', 'among', 'that', 'this', 'these', 'those',
    'it', 'its', 'i', 'we', 'you', 'they', 'he', 'she', 'him', 'her', 'them', 'their',
    'our', 'your', 'my', 'who', 'whom', 'whose', 'which', 'where', 'when', 'why', 'how',
    'all', 'any', 'both', 'each', 'few', 'more', 'most', 'some', 'such', 'no', 'nor',
    'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'app', 'business',
    'platform', 'service', 'product', 'idea'
  ]);
  
  // Split into words and filter out common words
  const words = cleanedText.split(' ')
    .filter(word => word.length > 3)
    .filter(word => !commonWords.has(word));
  
  // Count word frequency
  const wordCount = new Map<string, number>();
  for (const word of words) {
    wordCount.set(word, (wordCount.get(word) || 0) + 1);
  }
  
  // Sort by frequency
  const sortedWords = [...wordCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);
  
  // Return up to 5 most frequent words
  return sortedWords.slice(0, 5);
}

/**
 * Helper function to determine industry from idea
 */
function determineIndustry(idea: string): string {
  const ideaLower = idea.toLowerCase();
  
  // Try to identify industry from keywords
  if (ideaLower.match(/fitness|gym|workout|exercise|health|wellness|yoga/)) {
    return "fitness and wellness";
  }
  if (ideaLower.match(/food|restaurant|delivery|meal|recipe|cook|chef|dining/)) {
    return "food service";
  }
  if (ideaLower.match(/learn|education|course|teach|student|school|university|knowledge|skill/)) {
    return "education";
  }
  if (ideaLower.match(/finance|money|banking|invest|stock|crypto|payment|wallet|loan|credit/)) {
    return "financial technology";
  }
  if (ideaLower.match(/travel|hotel|flight|booking|vacation|trip|tourism|adventure/)) {
    return "travel and hospitality";
  }
  if (ideaLower.match(/real estate|property|home|apartment|rent|lease|buy|sell|house/)) {
    return "real estate";
  }
  if (ideaLower.match(/heal|doctor|medical|patient|hospital|clinic|therapy|diagnos/)) {
    return "healthcare";
  }
  if (ideaLower.match(/retail|shop|store|ecommerce|product|sell|customer|buy|purchase/)) {
    return "retail and e-commerce";
  }
  if (ideaLower.match(/game|play|entertain|fun|social|media|content|video|stream/)) {
    return "entertainment and media";
  }
  if (ideaLower.match(/ai|machine learning|tech|software|app|platform|data|algorithm|automat/)) {
    return "technology";
  }
  
  // Default if no specific industry is identified
  return "business";
}

/**
 * Helper function to capitalize first letter
 */
function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
