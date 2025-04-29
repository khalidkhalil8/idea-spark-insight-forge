
// Common utilities and shared constants

export const serpApiKey = Deno.env.get("SERPAPI_API_KEY") || "";
export const openAiApiKey = Deno.env.get("OPENAI_API_KEY") || "";
export const perplexityApiKey = Deno.env.get("PERPLEXITY_API_KEY") || "";

// Log environment variable status (without revealing values)
console.log("Environment variable status:");
console.log("- PERPLEXITY_API_KEY:", perplexityApiKey ? "Set" : "Not set");
console.log("- OPENAI_API_KEY:", openAiApiKey ? "Set" : "Not set");

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
