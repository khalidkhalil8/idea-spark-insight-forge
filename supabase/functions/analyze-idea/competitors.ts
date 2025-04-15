import { Competitor, corsHeaders } from "./utils.ts";
import { generateFallbackCompetitors } from "./fallbacks.ts";

// Product Hunt API token stored in Supabase secrets
const productHuntToken = Deno.env.get("PRODUCT_HUNT_API_TOKEN");

export async function getCompetitors(idea: string): Promise<Competitor[]> {
  try {
    // Extract keywords for better targeting fitness-specific ideas
    const keywords = extractKeywords(idea);
    const fitnessKeywords = ['fitness', 'workout', 'exercise', 'training', 'gym'];
    
    // Check if the idea is fitness-related and add specific keywords if needed
    const isFITNESS = fitnessKeywords.some(kw => idea.toLowerCase().includes(kw));
    const extraKeywords = isFITNESS ? 'fitness AI form feedback' : '';
    
    // Construct the GraphQL query for Product Hunt
    const searchTerm = `${idea} ${extraKeywords}`;
    console.log(`Searching for competitors with Product Hunt query: "${searchTerm}"`);
    
    const graphqlQuery = {
      query: `
        query {
          posts(first: 20, search: "${searchTerm}") {
            edges {
              node {
                name
                url
                description
                tagline
              }
            }
          }
        }
      `
    };
    
    const response = await fetch("https://api.producthunt.com/v2/api/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${productHuntToken}`,
        "Accept": "application/json",
      },
      body: JSON.stringify(graphqlQuery),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Product Hunt API error: ${errorText}`);
      throw new Error(`Product Hunt API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.data || !data.data.posts || !data.data.posts.edges) {
      console.error("Unexpected response format from Product Hunt API:", data);
      throw new Error("Invalid response format from Product Hunt API");
    }
    
    // Extract product data from response
    const productResults = data.data.posts.edges.map((edge: any) => ({
      name: edge.node.name,
      description: edge.node.tagline || edge.node.description || "No description available",
      website: edge.node.url
    }));
    
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

async function getAlternativeCompetitors(idea: string): Promise<Competitor[]> {
  try {
    // Extract more specific keywords from the idea for better targeting
    const keywords = extractKeywords(idea);
    const fitnessKeywords = ['fitness', 'workout', 'exercise', 'training', 'gym'];
    const isFITNESS = fitnessKeywords.some(kw => idea.toLowerCase().includes(kw));
    
    // Add fitness-specific terms if relevant
    const specificTerms = isFITNESS ? 'fitness workout exercise' : keywords.join(' ');
    
    // More targeted search focusing on product-related terms
    const searchTerm = `${specificTerms} app`;
    console.log(`Trying alternative Product Hunt search: "${searchTerm}"`);
    
    const graphqlQuery = {
      query: `
        query {
          posts(first: 20, search: "${searchTerm}") {
            edges {
              node {
                name
                url
                description
                tagline
              }
            }
          }
        }
      `
    };
    
    const response = await fetch("https://api.producthunt.com/v2/api/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${productHuntToken}`,
        "Accept": "application/json",
      },
      body: JSON.stringify(graphqlQuery),
    });
    
    if (!response.ok) {
      throw new Error(`Alternative Product Hunt API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.data || !data.data.posts || !data.data.posts.edges) {
      throw new Error("Invalid response format from Product Hunt API in alternative search");
    }
    
    // Extract product data from response
    const productResults = data.data.posts.edges.map((edge: any) => ({
      name: edge.node.name,
      description: edge.node.tagline || edge.node.description || "No description available",
      website: edge.node.url
    }));
    
    // Apply filtering and deduplication
    const competitors = filterAndDeduplicateResults(productResults, idea);
    
    console.log(`Found ${competitors.length} competitors with alternative search`);
    return competitors.length > 0 ? competitors.slice(0, 5) : generateFallbackCompetitors(idea);
  } catch (error) {
    console.error("Error in alternative competitor search:", error);
    return generateFallbackCompetitors(idea);
  }
}

function extractKeywords(idea: string): string[] {
  // List of important business-related terms that should be prioritized
  const businessTerms = ['tracking', 'validating', 'business', 'ideas', 'api', 'apis', 'ai', 
                          'assistant', 'automation', 'platform', 'analytics', 'management', 'app',
                          'fitness', 'workout', 'exercise', 'form', 'feedback', 'training'];
  
  // Extract keywords, prioritizing business terms
  const words = idea.toLowerCase().split(' ');
  const extractedKeywords = words.filter(word => 
    word.length > 3 && !['the', 'and', 'that', 'with', 'for', 'this', 'from'].includes(word)
  );
  
  // Prioritize business terms
  const prioritizedKeywords = extractedKeywords.filter(word => 
    businessTerms.includes(word)
  );
  
  // If we found prioritized terms, use them; otherwise use the original filtered words
  return prioritizedKeywords.length > 0 
    ? prioritizedKeywords.slice(0, 3) 
    : extractedKeywords.slice(0, 3);
}

function filterAndDeduplicateResults(results: any[], idea: string): Competitor[] {
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
