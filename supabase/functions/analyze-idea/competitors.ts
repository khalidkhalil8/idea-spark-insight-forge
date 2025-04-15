
import { Competitor } from "./utils.ts";
import { generateFallbackCompetitors } from "./fallbacks.ts";
import { searchProductHunt } from "./productHuntApi.ts";
import { extractKeywords, isFitnessIdea } from "./keywordExtraction.ts";
import { filterAndDeduplicateResults } from "./resultFiltering.ts";

/**
 * Main function to get competitors for a business idea
 */
export async function getCompetitors(idea: string): Promise<Competitor[]> {
  try {
    // Check if the idea is fitness-related and add specific keywords if needed
    const isFitness = isFitnessIdea(idea);
    const extraKeywords = isFitness ? 'fitness AI form feedback' : '';
    
    // Construct the search term
    const searchTerm = `${idea} ${extraKeywords}`.trim();
    
    // Search for competitors using Product Hunt API
    const productResults = await searchProductHunt(searchTerm);
    
    console.log(`Found ${productResults.length} initial results from Product Hunt API`);
    
    // Apply filtering and deduplication
    let competitors = filterAndDeduplicateResults(productResults, idea);
    
    if (competitors.length < 5) {
      // Try alternative search if not enough competitors found
      return await getAlternativeCompetitors(idea);
    }
    
    console.log(`Returning ${Math.min(competitors.length, 5)} filtered competitors`);
    return competitors.slice(0, 5);
  } catch (error) {
    console.error("Error getting competitors from Product Hunt:", error);
    return await getAlternativeCompetitors(idea);
  }
}

/**
 * Fallback search using more targeted keywords
 */
async function getAlternativeCompetitors(idea: string): Promise<Competitor[]> {
  try {
    // Extract more specific keywords from the idea for better targeting
    const keywords = extractKeywords(idea);
    const isFitness = isFitnessIdea(idea);
    
    // Add fitness-specific terms if relevant
    const specificTerms = isFitness ? 'fitness workout exercise' : keywords.join(' ');
    
    // More targeted search focusing on product-related terms
    const searchTerm = `${specificTerms} app`;
    console.log(`Trying alternative Product Hunt search: "${searchTerm}"`);
    
    // Search for competitors using Product Hunt API with alternative search term
    const productResults = await searchProductHunt(searchTerm);
    
    // Apply filtering and deduplication
    const competitors = filterAndDeduplicateResults(productResults, idea);
    
    console.log(`Found ${competitors.length} competitors with alternative search`);
    return competitors.length > 0 ? competitors.slice(0, 5) : generateFallbackCompetitors(idea);
  } catch (error) {
    console.error("Error in alternative competitor search:", error);
    return generateFallbackCompetitors(idea);
  }
}
