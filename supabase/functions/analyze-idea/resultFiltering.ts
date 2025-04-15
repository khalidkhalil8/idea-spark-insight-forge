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
    
    // Prioritize results that seem like actual products/platforms
    return hasRelevantKeyword || nameLower.includes('app') || descriptionLower.includes('app');
  });

  // Deduplicate the results by normalized company name
  const seenCompanies = new Set<string>();
  const deduplicated = filtered.filter(competitor => {
    // Create a normalized version of the name for comparison
    const normalizedName = competitor.name.toLowerCase().replace(/\s+/g, '');
    
    // Check if we've seen this company before
    if (seenCompanies.has(normalizedName)) {
      return false;
    }
    
    // Add to seen set and keep this result
    seenCompanies.add(normalizedName);
    return true;
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
