
// Common utilities and shared constants

export const serpApiKey = Deno.env.get("SERPAPI_API_KEY") || "";
export const openAiApiKey = Deno.env.get("OPENAI_API_KEY") || "";
export const productHuntApiToken = Deno.env.get("PRODUCT_HUNT_API_TOKEN") || "";

// Log environment variable status (without revealing values)
console.log("Environment variable status:");
console.log("- SERPAPI_API_KEY:", serpApiKey ? "Set" : "Not set");
console.log("- OPENAI_API_KEY:", openAiApiKey ? "Set" : "Not set");
console.log("- PRODUCT_HUNT_API_TOKEN:", productHuntApiToken ? "Set" : "Not set");

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export interface Competitor {
  name: string;
  description: string;
  website: string;
}

export interface AnalysisResult {
  competitors: Competitor[];
  marketGaps?: string[];
  gapAnalysis?: string;
  positioningSuggestions: string[];
}
