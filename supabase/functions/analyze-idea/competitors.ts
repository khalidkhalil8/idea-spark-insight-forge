
import { serpApiKey, Competitor, corsHeaders } from "./utils.ts";
import { generateFallbackCompetitors } from "./fallbacks.ts";

export async function getCompetitors(idea: string): Promise<Competitor[]> {
  try {
    // Create a more targeted search query to find actual products and companies
    // Extract key concepts from the idea
    const keyTerms = idea.split(" ")
      .filter(word => word.length > 3 && !['with', 'that', 'this', 'from', 'their', 'have', 'will'].includes(word.toLowerCase()))
      .slice(0, 5);
    
    // Add business-specific terms to improve results quality
    const searchTerm = `${keyTerms.join(" ")} top companies competitors products startups`;
    console.log(`Searching for: "${searchTerm}"`);
    
    const response = await fetch(
      `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(searchTerm)}&num=10&api_key=${serpApiKey}`
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`SerpAPI error: ${errorText}`);
      throw new Error(`SerpAPI request failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract organic results and ensure we're getting actual companies/products
    let organicResults = data.organic_results || [];
    
    // Filter more strictly to find actual company/product pages
    const competitors = organicResults
      .filter(result => 
        result.title && 
        result.snippet && 
        result.link && 
        !result.link.includes("wikipedia.org") &&
        !result.link.includes("linkedin.com") &&
        !result.link.includes("gartner.com") &&
        !result.link.includes("forbes.com") &&
        !result.link.includes("capterra.com") &&
        !result.link.includes("g2.com") &&
        !result.link.includes("youtube.com") &&
        !result.link.includes("news.")
      )
      .slice(0, 5)
      .map(result => {
        // Extract company name more carefully
        let name = result.title;
        
        // Remove common suffixes like "- Product", "| Official Site", etc.
        name = name.split(' - ')[0].split(' | ')[0].split(': ')[0];
        
        // Handle domains in company names
        if (name.includes('.com') || name.includes('.io') || name.includes('.ai')) {
          name = name.split('.')[0];
        }
        
        return {
          name: name,
          description: result.snippet,
          website: result.link
        };
      });
    
    console.log(`Found ${competitors.length} competitors`);
    
    if (competitors.length < 3) {
      // If we don't have enough companies, try a different search approach
      return await getAlternativeCompetitors(idea);
    }
    
    return competitors;
  } catch (error) {
    console.error("Error getting competitors:", error);
    // Fallback to alternative search if SerpAPI fails
    return await getAlternativeCompetitors(idea);
  }
}

async function getAlternativeCompetitors(idea: string): Promise<Competitor[]> {
  try {
    // Try a more direct product-focused search
    const searchTerm = `best ${idea.split(" ").slice(0, 3).join(" ")} products companies`;
    console.log(`Trying alternative search: "${searchTerm}"`);
    
    const response = await fetch(
      `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(searchTerm)}&num=10&api_key=${serpApiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`Alternative SerpAPI request failed: ${response.status}`);
    }
    
    const data = await response.json();
    const organicResults = data.organic_results || [];
    
    // Process the results similar to above
    const competitors = organicResults
      .filter(result => 
        result.title && 
        result.snippet && 
        result.link &&
        !result.link.includes("wikipedia.org") &&
        !result.link.includes("linkedin.com")
      )
      .slice(0, 5)
      .map(result => {
        let name = result.title.split(' - ')[0].split(' | ')[0];
        
        if (name.includes('.com') || name.includes('.io') || name.includes('.ai')) {
          name = name.split('.')[0];
        }
        
        return {
          name: name,
          description: result.snippet,
          website: result.link
        };
      });
      
    console.log(`Found ${competitors.length} competitors with alternative search`);
    return competitors.length > 0 ? competitors : generateFallbackCompetitors(idea);
  } catch (error) {
    console.error("Error in alternative competitor search:", error);
    return generateFallbackCompetitors(idea);
  }
}
