
import { openAiApiKey, Competitor, AnalysisResult, corsHeaders } from "./utils.ts";
import { generateFallbackAnalysis } from "./fallbacks.ts";

export async function getGapAnalysis(idea: string, competitors: Competitor[]): Promise<AnalysisResult> {
  try {
    console.log("Getting gap analysis from OpenAI for idea:", idea);
    
    // Create competitor descriptions for context
    const competitorDescriptions = competitors
      .map(c => `${c.name}: ${c.description} (Website: ${c.website})`)
      .join("\n\n");
    
    // Updated prompt with explicit JSON formatting instructions
    const prompt = `
      Return a JSON object with 3 specific market gaps for the business idea "${idea}", based on industry trends, customer pain points, and opportunities. Each gap is a string, max 50 words, tailored to the idea's features.
      
      Here are some potential competitors in this market space:
      ${competitorDescriptions}
      
      Your response MUST be a valid JSON object with exactly this format:
      {"marketGaps": ["Lack of mobile tools for X", "No affordable Y for Z", "Unmet need for A in B"], "positioningSuggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"]}
      
      Do not include any markdown, text, or explanations outside the JSON object. The JSON object should be the only thing in your response.
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
            content: "You are an API that returns only valid JSON. No markdown, no text, only the JSON object requested by the user in exactly the format specified." 
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.5
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI error: ${errorText}`);
      throw new Error(`OpenAI request failed: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("OpenAI raw response:", data.choices[0].message.content);
    
    try {
      // Clean the response to ensure it's valid JSON
      const cleanedContent = data.choices[0].message.content.trim()
        .replace(/^```json/g, '')
        .replace(/```$/g, '')
        .trim();
      
      console.log("Cleaned JSON content:", cleanedContent);
      
      // Try to parse the content as JSON
      const result = JSON.parse(cleanedContent);
      
      // Validate the response structure
      if (!result.marketGaps || !Array.isArray(result.marketGaps) || !result.positioningSuggestions || !Array.isArray(result.positioningSuggestions)) {
        throw new Error("Invalid response format from OpenAI: missing marketGaps or positioningSuggestions");
      }
      
      // Ensure we have exactly 3 market gaps
      while (result.marketGaps.length < 3) {
        result.marketGaps.push("Further market research is needed to identify additional opportunities in this space.");
      }
      if (result.marketGaps.length > 3) {
        result.marketGaps = result.marketGaps.slice(0, 3);
      }
      
      // Ensure we have exactly 3 positioning suggestions
      while (result.positioningSuggestions.length < 3) {
        result.positioningSuggestions.push("Develop a unique value proposition that differentiates from existing competitors.");
      }
      if (result.positioningSuggestions.length > 3) {
        result.positioningSuggestions = result.positioningSuggestions.slice(0, 3);
      }
      
      console.log("Parsed OpenAI response:", result);
      
      return {
        competitors,
        marketGaps: result.marketGaps,
        positioningSuggestions: result.positioningSuggestions
      };
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError, "Content:", data.choices[0].message.content);
      throw new Error(`Failed to parse OpenAI response: ${parseError.message}`);
    }
  } catch (error) {
    console.error("Error getting gap analysis:", error);
    throw error;
  }
}
