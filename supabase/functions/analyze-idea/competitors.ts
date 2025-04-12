
import { serpApiKey, Competitor, corsHeaders } from "./utils.ts";
import { generateFallbackCompetitors } from "./fallbacks.ts";

export async function getCompetitors(idea: string): Promise<Competitor[]> {
  try {
    // First search attempt specifically for competitors
    const searchTerm = `competitors of ${idea}`;
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
    let organicResults = data.organic_results || [];
    
    // Filter for actual business websites
    let competitors = filterBusinessResults(organicResults);
    
    if (competitors.length < 4) {
      // If not enough competitors found, try a more direct product search
      return await getProductBasedCompetitors(idea);
    }
    
    return competitors.slice(0, 5);
  } catch (error) {
    console.error("Error getting competitors:", error);
    return await getProductBasedCompetitors(idea);
  }
}

async function getProductBasedCompetitors(idea: string): Promise<Competitor[]> {
  try {
    // Try a more direct product/service-focused search
    const searchTerm = `best ${idea} companies products services`;
    console.log(`Trying product-based search: "${searchTerm}"`);
    
    const response = await fetch(
      `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(searchTerm)}&num=15&api_key=${serpApiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`Product-based SerpAPI request failed: ${response.status}`);
    }
    
    const data = await response.json();
    const organicResults = data.organic_results || [];
    
    // Filter for actual business websites
    const competitors = filterBusinessResults(organicResults);
    
    console.log(`Found ${competitors.length} competitors with product-based search`);
    return competitors.length > 0 ? competitors.slice(0, 5) : generateFallbackCompetitors(idea);
  } catch (error) {
    console.error("Error in product-based competitor search:", error);
    return generateFallbackCompetitors(idea);
  }
}

function filterBusinessResults(results: any[]): Competitor[] {
  // Filter to focus on business/commercial websites
  return results
    .filter(result => 
      result.title && 
      result.snippet && 
      result.link && 
      // Exclude informational and non-commercial websites
      !result.link.includes("wikipedia.org") &&
      !result.link.includes("linkedin.com") &&
      !result.link.includes("gartner.com") &&
      !result.link.includes("forbes.com") &&
      !result.link.includes("capterra.com") &&
      !result.link.includes("g2.com") &&
      !result.link.includes("youtube.com") &&
      !result.link.includes("news.") &&
      !result.link.includes("reddit.com") &&
      !result.link.includes("quora.com") &&
      !result.link.includes("blog.") &&
      !result.link.includes("techcrunch.com") &&
      !result.title.toLowerCase().includes("top 10") &&
      !result.title.toLowerCase().includes("best") &&
      !result.title.toLowerCase().includes("comparison") &&
      !result.title.toLowerCase().includes("vs")
    )
    .map(result => {
      // Extract company name more carefully
      let name = result.title;
      
      // Remove common suffixes like "- Product", "| Official Site", etc.
      name = name.split(' - ')[0].split(' | ')[0].split(': ')[0];
      
      // Remove common website suffixes
      if (name.includes('.com') || name.includes('.io') || name.includes('.ai')) {
        name = name.replace(/\.(com|io|ai|org|net)/, '');
      }
      
      return {
        name: name.trim(),
        description: result.snippet,
        website: result.link
      };
    });
}
