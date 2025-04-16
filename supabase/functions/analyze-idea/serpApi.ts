
import { Competitor, corsHeaders, serpApiKey } from "./utils.ts";

/**
 * Search for competitors using SerpAPI
 */
export async function searchSerpApi(searchTerm: string): Promise<Competitor[]> {
  console.log(`Searching SerpAPI with query: "${searchTerm}"`);
  
  // Construct the SerpAPI URL with the search query
  const encodedQuery = encodeURIComponent(`${searchTerm} apps site:.com | site:.co | site:.io -inurl:(blog | article | guide | how-to | news | review | podcast | forum | wiki | login | signup | about | pricing | resources | listicle)`);
  const apiUrl = `https://serpapi.com/search.json?engine=google&q=${encodedQuery}&api_key=${serpApiKey}&num=10`;
  
  try {
    console.log("Using SerpAPI API key:", serpApiKey ? "Set" : "Not set");
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`SerpAPI error (${response.status}): ${errorText}`);
      throw new Error(`SerpAPI request failed: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    
    if (!data.organic_results || !Array.isArray(data.organic_results)) {
      console.error("Unexpected response format from SerpAPI:", data);
      throw new Error("Invalid response format from SerpAPI");
    }
    
    console.log(`Found ${data.organic_results.length} raw results from SerpAPI`);
    
    // Extract competitor data from organic results
    return data.organic_results
      .filter((result: any) => result.title && result.link)
      .map((result: any) => ({
        name: result.title.split('-')[0].trim(), // Extract just the app name from the title
        description: result.snippet || "No description available",
        website: result.link
      }))
      .slice(0, 10); // Get top 10 results for filtering
  } catch (error) {
    console.error("Error in searchSerpApi:", error);
    throw error;
  }
}
