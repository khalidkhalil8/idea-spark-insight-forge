
// Common utilities and shared constants

export const serpApiKey = Deno.env.get("SERPAPI_API_KEY");
export const openAiApiKey = Deno.env.get("OPENAI_API_KEY");

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
