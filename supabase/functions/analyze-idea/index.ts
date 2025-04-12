
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

    // Get competitors using SerpAPI with improved query construction
    const competitors = await getCompetitors(idea);
    console.log(`Found ${competitors.length} competitors`);
    
    try {
      // Get gap analysis using OpenAI with more specific prompting
      const analysisResult = await getGapAnalysis(idea, competitors);
      console.log("Successfully generated analysis using OpenAI");
      
      return new Response(
        JSON.stringify({ ...analysisResult }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (openAiError) {
      console.error("OpenAI analysis failed, using fallback:", openAiError.message);
      
      // If OpenAI fails, use fallback but indicate this in the response
      const fallbackAnalysis = await generateFallbackAnalysis(idea, competitors);
      return new Response(
        JSON.stringify({ 
          ...fallbackAnalysis, 
          isOpenAiFallback: true,
          openAiError: openAiError.message || "OpenAI API not responding—please try again."
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
