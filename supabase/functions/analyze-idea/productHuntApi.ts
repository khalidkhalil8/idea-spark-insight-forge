
import { Competitor, corsHeaders, productHuntApiToken } from "./utils.ts";

/**
 * Search Product Hunt for products matching the given search term
 */
export async function searchProductHunt(searchTerm: string): Promise<Competitor[]> {
  console.log(`Searching Product Hunt with query: "${searchTerm}"`);
  
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
      "Authorization": `Bearer ${productHuntApiToken}`,
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
  return data.data.posts.edges.map((edge: any) => ({
    name: edge.node.name,
    description: edge.node.tagline || edge.node.description || "No description available",
    website: edge.node.url
  }));
}
