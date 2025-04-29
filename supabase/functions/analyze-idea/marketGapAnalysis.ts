
import { openAiApiKey, Competitor, AnalysisResult, corsHeaders } from "./utils.ts";

/**
 * Gets market gap analysis using OpenAI
 */
export async function getMarketGapAnalysis(idea: string, competitors: Competitor[]): Promise<AnalysisResult> {
  try {
    console.log("Getting gap analysis from OpenAI for idea:", idea);
    
    // Create competitor descriptions for context
    const competitorDescriptions = competitors
      .map(c => `${c.name}: ${c.description} (Website: ${c.website})`)
      .join("\n\n");
    
    // Updated prompt with explicit JSON formatting instructions
    const prompt = generateAnalysisPrompt(idea, competitorDescriptions);
    
    console.log("Sending OpenAI request with prompt length:", prompt.length);
    
    const response = await makeOpenAiRequest(prompt);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI error: ${errorText}`);
      throw new Error(`OpenAI request failed: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("OpenAI raw response:", data.choices[0].message.content);
    
    return parseAndValidateResponse(data, competitors);
  } catch (error) {
    console.error("Error getting gap analysis:", error);
    throw error;
  }
}

/**
 * Generates the prompt for OpenAI analysis
 */
function generateAnalysisPrompt(idea: string, competitorDescriptions: string): string {
  return `
    You are analyzing a business idea: "${idea}".
    
    Here are the direct competitors in this market space:
    ${competitorDescriptions}
    
    Based on these competitors and the business idea, please:
    1. Identify 3 potential gaps in the market not addressed by these competitors
    2. Suggest a unique angle or approach for this business idea
    3. Recommend 3 specific features or positioning elements that would help differentiate this idea
    
    Format your response as a valid JSON object with this exact structure:
    {
      "marketGaps": [
        "First gap description - make this a specific opportunity not addressed by competitors",
        "Second gap description - another specific opportunity",
        "Third gap description - another specific opportunity"
      ],
      "positioningSuggestions": [
        "First positioning suggestion with specific feature or approach recommendation",
        "Second positioning suggestion with specific feature or approach recommendation",
        "Third positioning suggestion with specific feature or approach recommendation"
      ]
    }
    
    Make each description a separate paragraph with enough detail to be actionable (max 50 words each).
    Do not include any text, markdown, or explanations outside the JSON object.
  `;
}

/**
 * Makes the API request to OpenAI
 */
async function makeOpenAiRequest(prompt: string): Promise<Response> {
  return await fetch("https://api.openai.com/v1/chat/completions", {
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
}

/**
 * Parses and validates the OpenAI response
 */
function parseAndValidateResponse(data: any, competitors: Competitor[]): AnalysisResult {
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
}
