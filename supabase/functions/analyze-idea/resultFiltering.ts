import { Competitor } from "./utils.ts";
import { extractKeywords } from "./keywordExtraction.ts";

/**
 * Filters and deduplicates search results to improve relevance
 */
export function filterAndDeduplicateResults(results: any[], idea: string): Competitor[] {
  // Extract keywords from the idea for relevance checking
  const keywords = extractKeywords(idea);
  
  // Filter results to focus on actual products and platforms
  const filtered = results.filter(result => {
    if (!result.name || !result.website) {
      return false;
    }
    
    const nameLower = result.name.toLowerCase();
    const descriptionLower = result.description ? result.description.toLowerCase() : '';
    
    // Check if the title or description contains at least one keyword from the idea
    const hasRelevantKeyword = keywords.some(kw => 
      nameLower.includes(kw) || descriptionLower.includes(kw)
    );
    
    // Filter out common non-app results
    const isLikelyNonApp = 
      nameLower.includes('wikipedia') || 
      nameLower.includes('github') || 
      nameLower.includes('linkedin') ||
      nameLower.includes('youtube') ||
      nameLower.includes('facebook') ||
      nameLower.includes('twitter') ||
      nameLower.includes('tiktok') ||
      nameLower.includes('reddit');
    
    // Prioritize results that seem like actual products/platforms
    return hasRelevantKeyword && !isLikelyNonApp;
  });

  // Deduplicate the results by normalized website domain
  const seenDomains = new Set<string>();
  const deduplicated = filtered.filter(competitor => {
    try {
      // Extract domain from URL for deduplication
      const url = new URL(competitor.website.startsWith('http') ? competitor.website : `https://${competitor.website}`);
      const domain = url.hostname.replace('www.', '');
      
      // Check if we've seen this domain before
      if (seenDomains.has(domain)) {
        return false;
      }
      
      // Add to seen set and keep this result
      seenDomains.add(domain);
      return true;
    } catch (e) {
      // If URL parsing fails, use the whole website string
      if (seenDomains.has(competitor.website)) {
        return false;
      }
      seenDomains.add(competitor.website);
      return true;
    }
  });
    
  // Sort results to prioritize those that seem most relevant to the business idea
  return deduplicated.sort((a, b) => {
    const aRelevance = keywords.filter(kw => 
      a.name.toLowerCase().includes(kw) || 
      a.description.toLowerCase().includes(kw)
    ).length;
    
    const bRelevance = keywords.filter(kw => 
      b.name.toLowerCase().includes(kw) || 
      b.description.toLowerCase().includes(kw)
    ).length;
    
    return bRelevance - aRelevance;
  });
}
