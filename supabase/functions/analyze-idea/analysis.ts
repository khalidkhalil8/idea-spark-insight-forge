
import { openAiApiKey, Competitor, AnalysisResult, corsHeaders } from "./utils.ts";
import { generateFallbackAnalysis } from "./fallbacks.ts";

export async function getGapAnalysis(idea: string, competitors: Competitor[]): Promise<AnalysisResult> {
  try {
    console.log("Getting gap analysis from OpenAI for idea:", idea);
    
    // Create more detailed competitor descriptions for better analysis
    const competitorDescriptions = competitors
      .map(c => `${c.name}: ${c.description} (Website: ${c.website})`)
      .join("\n\n");
    
    // Updated prompt with the exact requirements specified
    const prompt = `
      Given the business idea "${idea}", identify 3 specific market gaps based on current industry trends, customer pain points, and emerging opportunities. Provide actionable insights tailored to the idea, citing specific aspects like features, target audience, or unmet needs. Avoid generic responses.
      
      Here are some potential competitors in this market space:
      ${competitorDescriptions}
      
      Format your response as a JSON object with keys "marketGaps" (array of 3 strings, one for each specific gap identified) and "positioningSuggestions" (array of 3 strings). Each market gap should be a clear, specific opportunity statement. Each positioning suggestion should reference specific market gaps and competitor weaknesses.
    `;
    
    console.log("Sending OpenAI request with prompt length:", prompt.length);
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openAiApiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { 
            role: "system", 
            content: "You are a specialized market research analyst with deep industry knowledge across sectors. Your expertise is identifying specific market gaps and opportunities for new business ideas. You provide detailed, actionable insights tailored to each unique business concept. Never provide generic advice - all feedback must directly relate to the specific idea being analyzed." 
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI error: ${errorText}`);
      throw new Error(`OpenAI request failed: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("OpenAI response received, parsing...");
    
    let result;
    try {
      // Try to parse the content as JSON
      result = JSON.parse(data.choices[0].message.content);
      
      // Validate the response structure
      if (!result.marketGaps || !Array.isArray(result.marketGaps) || !result.positioningSuggestions || !Array.isArray(result.positioningSuggestions)) {
        throw new Error("Invalid response format from OpenAI");
      }
      
      // Ensure we have exactly 3 market gaps
      if (result.marketGaps.length < 3) {
        while (result.marketGaps.length < 3) {
          result.marketGaps.push("Further market research is needed to identify additional opportunities in this space.");
        }
      } else if (result.marketGaps.length > 3) {
        result.marketGaps = result.marketGaps.slice(0, 3);
      }
      
      // Ensure we have exactly 3 positioning suggestions
      if (result.positioningSuggestions.length < 3) {
        while (result.positioningSuggestions.length < 3) {
          result.positioningSuggestions.push("Develop a unique value proposition that differentiates from existing competitors.");
        }
      } else if (result.positioningSuggestions.length > 3) {
        result.positioningSuggestions = result.positioningSuggestions.slice(0, 3);
      }
      
    } catch (e) {
      // If parsing fails, create a structured object from the text response
      console.log("Could not parse OpenAI response as JSON, extracting manually:", e);
      const content = data.choices[0].message.content;
      
      // Extract market gaps by looking for numbered items or sections
      const gapMatches = content.match(/(?:gap|opportunity)\s*(?:\d+|:|-)?\s*(.*?)(?:\n|$)/gi) || [];
      const marketGaps = gapMatches
        .map(match => match.replace(/^(?:gap|opportunity)\s*(?:\d+|:|-)?\s*/i, '').trim())
        .filter(gap => gap.length > 10)
        .slice(0, 3);
      
      // Extract positioning suggestions
      const suggestions = content.match(/\d+\.\s*(.*?)(?:\n|$)/g) || [];
      const positioningSuggestions = suggestions
        .map(s => s.replace(/^\d+\.\s*/, '').trim())
        .filter(s => s.length > 10);
      
      // Ensure we have exactly 3 market gaps
      while (marketGaps.length < 3) {
        marketGaps.push("Further market research is needed to identify additional opportunities in this space.");
      }
      
      result = {
        marketGaps: marketGaps.slice(0, 3),
        positioningSuggestions: positioningSuggestions.length >= 3 ? 
          positioningSuggestions.slice(0, 3) : 
          [
            "Target a specific customer segment with unique needs that competitors aren't addressing",
            "Focus on solving specific pain points that existing competitors have missed",
            "Create strategic partnerships to overcome entry barriers in this market"
          ]
      };
    }
    
    console.log("Parsed OpenAI response:", result);
    
    return {
      competitors,
      marketGaps: result.marketGaps,
      positioningSuggestions: result.positioningSuggestions
    };
  } catch (error) {
    console.error("Error getting gap analysis:", error);
    throw error;
  }
}
