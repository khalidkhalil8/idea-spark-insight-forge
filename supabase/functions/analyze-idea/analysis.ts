
import { openAiApiKey, Competitor, AnalysisResult, corsHeaders } from "./utils.ts";
import { generateFallbackAnalysis } from "./fallbacks.ts";

export async function getGapAnalysis(idea: string, competitors: Competitor[]): Promise<AnalysisResult> {
  try {
    console.log("Getting gap analysis from OpenAI");
    
    // Create more detailed competitor descriptions for better analysis
    const competitorDescriptions = competitors
      .map(c => `${c.name}: ${c.description} (Website: ${c.website})`)
      .join("\n\n");
    
    // Craft a more specific prompt for OpenAI to generate better results
    const prompt = `
      Analyze this business idea in detail:
      
      "${idea}"
      
      Here are some potential competitors in this market space:
      ${competitorDescriptions}
      
      Please provide:
      
      1. Identify 3 SPECIFIC market gaps based on current industry trends, customer pain points, and emerging opportunities that this business idea could address. Each gap should represent a concrete opportunity that existing competitors are not fully addressing. Be extremely specific and avoid generic statements.
      
      2. Four highly specific positioning suggestions tailored to this particular idea. Each suggestion should be actionable, practical, and directly related to the specific business domain of the idea. Reference specific aspects of the business idea and how they can be leveraged.
      
      Format your response as a JSON object with keys "gapAnalysis" (string) and "positioningSuggestions" (array of strings). The gapAnalysis should be a 3-4 sentence paragraph summarizing the 3 specific market gaps. Each positioning suggestion should be a single actionable statement.
      
      Your analysis must be tailored specifically to this business idea. Avoid generic advice that could apply to any business.
    `;
    
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
    
    let result;
    try {
      // Try to parse the content as JSON
      result = JSON.parse(data.choices[0].message.content);
    } catch (e) {
      // If parsing fails, create a structured object from the text response
      console.log("Could not parse OpenAI response as JSON, extracting manually");
      const content = data.choices[0].message.content;
      
      // Extract gap analysis
      const gapAnalysisMatch = content.match(/gap analysis.*?:?\s*["']?(.*?)["']?(\n|$)/i);
      const gapAnalysis = gapAnalysisMatch ? gapAnalysisMatch[1].trim() : 
        "Based on the market analysis, there appears to be a significant opportunity to differentiate this idea by addressing specific customer needs that current solutions overlook.";
      
      // Extract positioning suggestions
      const suggestions = content.match(/\d+\.\s*(.*?)(\n|$)/g) || [];
      const positioningSuggestions = suggestions.map(s => s.replace(/^\d+\.\s*/, '').trim());
      
      result = {
        gapAnalysis,
        positioningSuggestions: positioningSuggestions.length >= 4 ? positioningSuggestions : [
          "Target a specific customer segment with unique needs that competitors aren't addressing",
          "Emphasize your idea's unique technical approach compared to existing solutions",
          "Create strategic partnerships to overcome entry barriers in this market",
          "Focus on solving specific pain points that existing competitors have missed"
        ]
      };
    }
    
    return {
      competitors,
      gapAnalysis: result.gapAnalysis,
      positioningSuggestions: result.positioningSuggestions
    };
  } catch (error) {
    console.error("Error getting gap analysis:", error);
    // Fallback to generating gap analysis
    return generateFallbackAnalysis(idea, competitors);
  }
}
