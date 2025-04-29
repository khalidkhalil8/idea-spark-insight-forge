
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { getCompetitors } from "./competitors.ts";
import { getGapAnalysis } from "./analysis.ts";
import { corsHeaders } from "./utils.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { idea, analysisType } = await req.json();
    if (!idea) {
      return new Response(
        JSON.stringify({ error: "Idea is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Analyzing idea: ${idea}`);
    console.log(`Analysis type: ${analysisType || 'full'}`);
    
    // If only competitors are requested, return them directly
    if (analysisType === 'competitors-only') {
      try {
        console.log("Getting competitors only");
        const competitors = await getCompetitors(idea);
        return new Response(
          JSON.stringify({ competitors }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (error) {
        console.error("Error getting competitors:", error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    
    // If only differentiation suggestions are requested
    if (analysisType === 'differentiation-suggestions') {
      try {
        // Get competitors first
        const competitors = await getCompetitors(idea);
        
        // Then get gap analysis with positioning suggestions
        const analysisResult = await getGapAnalysis(idea, competitors);
        
        return new Response(
          JSON.stringify({ positioningSuggestions: analysisResult.positioningSuggestions }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (error) {
        console.error("Error getting differentiation suggestions:", error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    
    // Default case: Full analysis
    try {
      // Get competitors using Perplexity API
      const competitors = await getCompetitors(idea);
      console.log(`Found ${competitors.length} competitors`);
      
      // Get gap analysis using OpenAI
      const analysisResult = await getGapAnalysis(idea, competitors);
      console.log("Successfully generated analysis");
      
      // Return complete result
      return new Response(
        JSON.stringify(analysisResult),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("Error in analysis:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
