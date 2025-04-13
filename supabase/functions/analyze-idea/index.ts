
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { getCompetitors } from "./competitors.ts";
import { getGapAnalysis } from "./analysis.ts";
import { corsHeaders } from "./utils.ts";
import { generateFallbackAnalysis } from "./fallbacks.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { idea } = await req.json();
    if (!idea) {
      return new Response(
        JSON.stringify({ error: "Idea is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Analyzing idea: ${idea}`);
    let searchQuery = `${idea} competitors site:.com | site:.co | site:.io -inurl:(blog | article | guide | how-to | news | review | podcast | forum | wiki | login | signup | about | pricing)`;

    try {
      // Get competitors using SerpAPI with improved query construction
      const competitors = await getCompetitors(idea);
      console.log(`Found ${competitors.length} competitors`);
      
      try {
        // Get gap analysis using OpenAI with specific JSON formatting
        const analysisResult = await getGapAnalysis(idea, competitors);
        console.log("Successfully generated analysis using OpenAI");
        
        return new Response(
          JSON.stringify({ ...analysisResult, searchQuery }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (openAiError) {
        console.error("OpenAI analysis failed:", openAiError.message);
        
        // If OpenAI fails, use fallback but indicate this in the response
        const fallbackAnalysis = await generateFallbackAnalysis(idea, competitors);
        return new Response(
          JSON.stringify({ 
            ...fallbackAnalysis, 
            isOpenAiFallback: true,
            openAiError: `OpenAI Error: ${openAiError.message}` || "OpenAI API not responding—please try again.",
            searchQuery
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } catch (serpApiError) {
      console.error("SerpAPI error:", serpApiError.message);
      
      // If SerpAPI fails but we still want to attempt OpenAI analysis with fallback competitors
      const fallbackCompetitors = [
        { name: "No competitors found", description: "SerpAPI search failed", website: "#" }
      ];
      
      try {
        // Try OpenAI analysis with fallback competitors
        const analysisResult = await getGapAnalysis(idea, fallbackCompetitors);
        return new Response(
          JSON.stringify({ 
            ...analysisResult,
            serpApiError: `SerpAPI Error: ${serpApiError.message}`,
            searchQuery
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (openAiError) {
        // Both APIs failed
        const fallbackAnalysis = generateFallbackAnalysis(idea, fallbackCompetitors);
        return new Response(
          JSON.stringify({ 
            ...fallbackAnalysis, 
            isOpenAiFallback: true,
            openAiError: `OpenAI Error: ${openAiError.message}`,
            serpApiError: `SerpAPI Error: ${serpApiError.message}`,
            searchQuery
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
