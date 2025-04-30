import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// Common utilities and shared constants
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const serpApiKey = Deno.env.get("SERPAPI_API_KEY") || "";
const openAiApiKey = Deno.env.get("OPENAI_API_KEY") || "";
const perplexityApiKey = Deno.env.get("PERPLEXITY_API_KEY") || "";

// Log environment variable status (without revealing values)
console.log("Environment variable status:");
console.log("- PERPLEXITY_API_KEY:", perplexityApiKey ? "Set" : "Not set");
console.log("- OPENAI_API_KEY:", openAiApiKey ? "Set" : "Not set");

interface Competitor {
  name: string;
  description: string;
  website: string;
}

interface AnalysisResult {
  competitors: Competitor[];
  marketGaps?: string[];
  gapAnalysis?: string;
  positioningSuggestions: string[];
}

// Keyword extraction functions
function extractKeywords(idea: string): string[] {
  // List of important business-related terms that should be prioritized
  const businessTerms = ['tracking', 'validating', 'business', 'ideas', 'api', 'apis', 'ai', 
                        'assistant', 'automation', 'platform', 'analytics', 'management', 'app',
                        'fitness', 'workout', 'exercise', 'form', 'feedback', 'training'];
  
  // Extract keywords, prioritizing business terms
  const words = idea.toLowerCase().split(' ');
  const extractedKeywords = words.filter(word => 
    word.length > 3 && !['the', 'and', 'that', 'with', 'for', 'this', 'from'].includes(word)
  );
  
  // Prioritize business terms
  const prioritizedKeywords = extractedKeywords.filter(word => 
    businessTerms.includes(word)
  );
  
  // If we found prioritized terms, use them; otherwise use the original filtered words
  return prioritizedKeywords.length > 0 
    ? prioritizedKeywords.slice(0, 3) 
    : extractedKeywords.slice(0, 3);
}

function isFitnessIdea(idea: string): boolean {
  const fitnessKeywords = ['fitness', 'workout', 'exercise', 'training', 'gym'];
  return fitnessKeywords.some(kw => idea.toLowerCase().includes(kw));
}

// Filtering and deduplication functions
function filterAndDeduplicateResults(results: any[], idea: string): Competitor[] {
  // Extract keywords from the idea for relevance checking
  const keywords = extractKeywords(idea);
  
  // Filter results to focus on actual products and platforms
  const filtered = results.filter(result => {
    if (!result.name || !result.website) {
      return false;
    }
    
    const nameLower = result.name.toLowerCase();
    const descriptionLower = result.description ? result.description.toLowerCase() : '';
    
    // Check if the title or description contains at least one keyword from the idea
    const hasRelevantKeyword = keywords.some(kw => 
      nameLower.includes(kw) || descriptionLower.includes(kw)
    );
    
    // Filter out common non-app results
    const isLikelyNonApp = 
      nameLower.includes('wikipedia') || 
      nameLower.includes('github') || 
      nameLower.includes('linkedin') ||
      nameLower.includes('youtube') ||
      nameLower.includes('facebook') ||
      nameLower.includes('twitter') ||
      nameLower.includes('tiktok') ||
      nameLower.includes('reddit');
    
    // Prioritize results that seem like actual products/platforms
    return hasRelevantKeyword && !isLikelyNonApp;
  });

  // Deduplicate the results by normalized website domain
  const seenDomains = new Set<string>();
  const deduplicated = filtered.filter(competitor => {
    try {
      // Extract domain from URL for deduplication
      const url = new URL(competitor.website.startsWith('http') ? competitor.website : `https://${competitor.website}`);
      const domain = url.hostname.replace('www.', '');
      
      // Check if we've seen this domain before
      if (seenDomains.has(domain)) {
        return false;
      }
      
      // Add to seen set and keep this result
      seenDomains.add(domain);
      return true;
    } catch (e) {
      // If URL parsing fails, use the whole website string
      if (seenDomains.has(competitor.website)) {
        return false;
      }
      seenDomains.add(competitor.website);
      return true;
    }
  });
    
  // Sort results to prioritize those that seem most relevant to the business idea
  return deduplicated.sort((a, b) => {
    const aRelevance = keywords.filter(kw => 
      a.name.toLowerCase().includes(kw) || 
      a.description.toLowerCase().includes(kw)
    ).length;
    
    const bRelevance = keywords.filter(kw => 
      b.name.toLowerCase().includes(kw) || 
      b.description.toLowerCase().includes(kw)
    ).length;
    
    return bRelevance - aRelevance;
  });
}

// Fallback functions
function generateFallbackCompetitors(idea: string): Competitor[] {
  console.log("Generating fallback competitors for:", idea);
  
  const fallbackCompetitors: Competitor[] = [];
  
  // Add generic competitors based on keywords
  if (idea.toLowerCase().includes("fitness") || idea.toLowerCase().includes("workout")) {
    fallbackCompetitors.push(
      {
        name: "Nike Training Club",
        website: "https://www.nike.com/ntc-app",
        description: "Free workout app offering training programs, fitness tracking, and personalized coaching."
      },
      {
        name: "Strava",
        website: "https://www.strava.com",
        description: "Activity tracking app for runners and cyclists with social features and detailed analytics."
      }
    );
  } else if (idea.toLowerCase().includes("productivity") || idea.toLowerCase().includes("task")) {
    fallbackCompetitors.push(
      {
        name: "Todoist",
        website: "https://todoist.com",
        description: "Task management app helping millions of people organize work and life."
      },
      {
        name: "Notion",
        website: "https://www.notion.so",
        description: "All-in-one workspace for notes, tasks, wikis, and databases."
      }
    );
  } else if (idea.toLowerCase().includes("recipe") || idea.toLowerCase().includes("food")) {
    fallbackCompetitors.push(
      {
        name: "Yummly",
        website: "https://www.yummly.com",
        description: "Personalized recipe recommendations based on your cooking preferences."
      },
      {
        name: "Mealime",
        website: "https://www.mealime.com",
        description: "Meal planning app with simple, healthy recipes and automatic grocery lists."
      }
    );
  } else {
    // Generic tech startup competitors
    fallbackCompetitors.push(
      {
        name: "Product Hunt",
        website: "https://www.producthunt.com",
        description: "Platform showcasing the best new products in tech every day."
      },
      {
        name: "Y Combinator",
        website: "https://www.ycombinator.com",
        description: "Startup accelerator that funds and supports early-stage startups."
      }
    );
  }
  
  // Add one more generic competitor
  fallbackCompetitors.push({
    name: "AngelList",
    website: "https://angel.co",
    description: "Platform connecting startups, angel investors, and job-seekers."
  });
  
  return fallbackCompetitors;
}

function generateFallbackAnalysis(idea: string, competitors: Competitor[]): AnalysisResult {
  console.log("Generating fallback analysis for:", idea);
  
  // Create generic market gaps based on the idea
  const marketGaps = [
    "There appears to be a lack of comprehensive solutions that address all aspects of this problem.",
    "Most competitors focus on experienced users, leaving an opportunity for more beginner-friendly alternatives.",
    "The market lacks affordable options that provide the same level of functionality as premium solutions."
  ];
  
  // Generate simple suggestions that could work for most ideas
  const positioningSuggestions = [
    "Focus on an underserved segment of the market by creating a simpler, more accessible solution with a gentle learning curve.",
    "Differentiate through superior user experience and design, making complex tasks feel effortless and intuitive.",
    "Consider a unique pricing model that disrupts the current market, such as a freemium approach with clear upgrade paths."
  ];
  
  return {
    competitors,
    marketGaps,
    positioningSuggestions
  };
}

// Perplexity API integration for competitor analysis
async function getCompetitors(idea: string): Promise<Competitor[]> {
  try {
    console.log("Getting competitors from Perplexity API for idea:", idea);
    
    // Construct a clear prompt for Perplexity
    const prompt = `Find 3-5 direct competitors to this business idea: "${idea}".
    
For each competitor, provide:
1. Company name
2. Website URL (must be accurate)
3. Brief description of what they offer

Format the response as a clean list with each competitor containing:
- Name: [Company Name]
- Website: [Website URL]
- Description: [Brief description]

Only include real, existing companies that are direct competitors to this idea. Do not include any irrelevant information or non-competitor websites.`;
    
    const competitors = await queryPerplexity(prompt);
    
    if (competitors.length === 0) {
      console.log("No competitors found, using fallback");
      return generateFallbackCompetitors(idea);
    }
    
    console.log(`Found ${competitors.length} competitors using Perplexity API`);
    return competitors;
  } catch (error) {
    console.error("Error getting competitors from Perplexity:", error);
    return generateFallbackCompetitors(idea);
  }
}

async function queryPerplexity(message: string): Promise<Competitor[]> {
  try {
    if (!perplexityApiKey) {
      throw new Error("Perplexity API key not found in environment variables");
    }
    
    console.log("Querying Perplexity API...");
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',  // Using "sonar" as the model name
        messages: [
          {
            role: 'system',
            content: 'You are a research assistant that provides accurate information about business competitors. Return only factual information about real companies that would be direct competitors to the business idea. Include company name, website URL, and a brief description for each competitor. Format the information clearly as "Name: [Company Name]", "Website: [URL]", "Description: [Description]" for each competitor.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.2,
        max_tokens: 2000
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Perplexity API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log("Perplexity response received");
    
    // Extract the text response
    const textResponse = data.choices[0].message.content;
    
    // Parse competitors from the text response
    return parseCompetitorsFromText(textResponse);
  } catch (error) {
    console.error("Error querying Perplexity:", error);
    throw error;
  }
}

function parseCompetitorsFromText(text: string): Competitor[] {
  console.log("Parsing competitors from text");
  
  const competitors: Competitor[] = [];
  
  // Split the text by double newlines or competitor numbers to separate competitors
  const sections = text.split(/(?:\n\n+|\n[0-9]+\.)/);
  
  for (const section of sections) {
    if (!section.trim()) continue;
    
    let name = "";
    let website = "";
    let description = "";
    
    // Look for structured "Name:" format
    const nameMatch = section.match(/Name:\s*([^\n]+)/i);
    if (nameMatch) {
      name = nameMatch[1].trim();
    } else {
      // Fallback to other formats
      const altNameMatch = section.match(/^[**]*([^:]+?)[**]*:/m) || 
                          section.match(/^[0-9]+\.\s+([^:]+?)(?:\s*\(|:|\n|$)/m) ||
                          section.match(/^[**]*([^**\n]+?)[**]*\s*(?:\n|$)/m);
      
      if (altNameMatch) {
        name = altNameMatch[1].trim();
      }
    }
    
    // Look for "Website:" format
    const websiteMatch = section.match(/Website:\s*(https?:\/\/[^\s,)"]+)/i);
    if (websiteMatch) {
      website = websiteMatch[1].trim();
    } else {
      // Fallback to other URL patterns
      const altUrlMatch = section.match(/(https?:\/\/[^\s,)"]+)/);
      
      if (altUrlMatch) {
        website = altUrlMatch[1].trim();
      } else if (section.match(/[a-z0-9-]+\.[a-z]{2,}/i)) {
        // Try to find domain-like text if no explicit URL
        const domainMatch = section.match(/(?:Website|URL|Domain):\s*([a-z0-9-]+\.[a-z]{2,})/i) || 
                            section.match(/\b([a-z0-9-]+\.[a-z]{2,})\b/i);
        if (domainMatch) {
          website = `https://${domainMatch[1].trim()}`;
        }
      }
    }
    
    // Look for "Description:" format
    const descriptionMatch = section.match(/Description:\s*([^\n]+(?:\n(?!\n)[^\n]+)*)/i);
    if (descriptionMatch) {
      description = descriptionMatch[1].trim();
    } else if (name) {
      // Fallback: extract description from remaining text
      const descText = section
        .replace(/Name:[^\n]+/i, '')
        .replace(/Website:[^\n]+/i, '')
        .replace(name, '')
        .replace(/^[0-9]+\.\s*/, '')
        .replace(/^\s*:\s*/, '')
        .replace(/^\s*\n/, '')
        .trim();
      
      description = descText;
    }
    
    // Clean up name (remove numbering if present)
    name = name.replace(/^[0-9]+\.\s*/, '').replace(/\*\*/g, '');
    
    // Only add if we have at least a name
    if (name) {
      competitors.push({
        name,
        website: website || "#",
        description: description || `Competitor in the ${name} space.`
      });
    }
  }
  
  // Filter out any competitors that look like headers or introduction text
  const filteredCompetitors = competitors.filter(comp => {
    return !comp.name.toLowerCase().includes('direct competitor') && 
           !comp.name.toLowerCase().includes('here are') &&
           comp.name.length < 50;
  });
  
  console.log(`Parsed ${filteredCompetitors.length} competitors from text`);
  return filteredCompetitors.slice(0, 5); // Limit to 5 competitors
}

// OpenAI API integration for market gap analysis
async function getMarketGapAnalysis(idea: string, competitors: Competitor[]): Promise<AnalysisResult> {
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

// Main gap analysis function
async function getGapAnalysis(idea: string, competitors: Competitor[]): Promise<AnalysisResult> {
  try {
    // Delegate to the specialized market gap analysis function
    return await getMarketGapAnalysis(idea, competitors);
  } catch (error) {
    console.error("Error getting gap analysis:", error);
    return generateFallbackAnalysis(idea, competitors);
  }
}

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
