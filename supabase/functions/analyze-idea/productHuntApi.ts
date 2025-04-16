
import { Competitor, corsHeaders, productHuntApiToken } from "./utils.ts";

/**
 * Search Product Hunt for products matching the given search term
 */
export async function searchProductHunt(searchTerm: string): Promise<Competitor[]> {
  console.log(`Searching Product Hunt with query: "${searchTerm}"`);
  
  // GraphQL query using the search field with proper fragment for Product type
  const graphqlQuery = {
    query: `
      query {
        search(query: "${searchTerm}", first: 20) {
          edges {
            node {
              ... on Product {
                name
                website
                tagline
              }
            }
          }
        }
      }
    `
  };
  
  try {
    console.log("Using Product Hunt API token:", productHuntApiToken ? "Set" : "Not set");
    
    const response = await fetch("https://api.producthunt.com/v2/api/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${productHuntApiToken}`,
        "Accept": "application/json",
      },
      body: JSON.stringify(graphqlQuery),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Product Hunt API error (${response.status}): ${errorText}`);
      throw new Error(`Product Hunt API request failed: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    
    if (!data.data || !data.data.search || !data.data.search.edges) {
      console.error("Unexpected response format from Product Hunt API:", data);
      throw new Error("Invalid response format from Product Hunt API");
    }
    
    console.log(`Found ${data.data.search.edges.length} results from Product Hunt API`);
    
    // Extract product data from response - updated for the new search query structure
    return data.data.search.edges
      .filter((edge: any) => edge.node && edge.node.name && edge.node.website)
      .map((edge: any) => ({
        name: edge.node.name,
        description: edge.node.tagline || "No description available",
        website: edge.node.website
      }));
  } catch (error) {
    console.error("Error in searchProductHunt:", error);
    throw error;
  }
}
