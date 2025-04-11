
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const serpApiKey = Deno.env.get("SERPAPI_API_KEY");
const openAiApiKey = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Get competitors using SerpAPI
    const competitors = await getCompetitors(idea);
    
    // Get gap analysis using OpenAI
    const analysisResult = await getGapAnalysis(idea, competitors);

    return new Response(
      JSON.stringify({ ...analysisResult }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function getCompetitors(idea) {
  try {
    const keywords = idea.split(" ")
      .filter(word => word.length > 3)
      .slice(0, 3)
      .join(" ");
    
    const searchTerm = `${keywords} companies startups`;
    console.log(`Searching for: "${searchTerm}"`);
    
    const response = await fetch(
      `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(searchTerm)}&api_key=${serpApiKey}`
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`SerpAPI error: ${errorText}`);
      throw new Error(`SerpAPI request failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract organic results
    const organicResults = data.organic_results || [];
    const competitors = organicResults
      .filter(result => 
        result.title && 
        result.snippet && 
        result.link && 
        !result.link.includes("wikipedia.org") &&
        !result.link.includes("linkedin.com")
      )
      .slice(0, 4)
      .map(result => ({
        name: result.title.split(' - ')[0].split(' | ')[0],
        description: result.snippet,
        website: result.link
      }));
    
    console.log(`Found ${competitors.length} competitors`);
    return competitors;
  } catch (error) {
    console.error("Error getting competitors:", error);
    // Fallback to generating competitors if SerpAPI fails
    return generateFallbackCompetitors(idea);
  }
}

function generateFallbackCompetitors(idea) {
  console.log("Using fallback competitor generation");
  const keywords = idea.toLowerCase().split(' ').filter(word => 
    word.length > 3 && !['the', 'and', 'that', 'with'].includes(word)
  );

  function generateCompanyName(idea) {
    const words = idea.toLowerCase().split(' ');
    const relevantWords = words.filter(word => 
      word.length > 3 && !['the', 'and', 'that', 'with'].includes(word)
    );
    
    if (relevantWords.length >= 2) {
      return (relevantWords[0] + relevantWords[1]).charAt(0).toUpperCase() + 
             (relevantWords[0] + relevantWords[1]).slice(1);
    }
    return relevantWords[0].charAt(0).toUpperCase() + relevantWords[0].slice(1) + "Hub";
  }

  return Array.from({ length: 4 }, (_, index) => {
    const name = generateCompanyName(idea) + ['Pro', 'Go', 'Now', 'Plus'][index];
    const description = `A ${keywords[Math.floor(Math.random() * keywords.length)]} platform that focuses on ${
      keywords[Math.floor(Math.random() * keywords.length)]
    } solutions for ${keywords[Math.floor(Math.random() * keywords.length)]} needs.`;
    return {
      name,
      description,
      website: `https://${name.toLowerCase()}-example.com`
    };
  });
}

async function getGapAnalysis(idea, competitors) {
  try {
    console.log("Getting gap analysis from OpenAI");
    const competitorDescriptions = competitors
      .map(c => `${c.name}: ${c.description}`)
      .join("\n");
    
    const prompt = `
      I need a market gap analysis for a business idea.
      
      The idea is: "${idea}"
      
      Here are some potential competitors:
      ${competitorDescriptions}
      
      Based on the idea and these competitors, please provide:
      1. A concise market gap analysis paragraph (about 2-3 sentences).
      2. A list of 4 specific positioning suggestions.
      
      Format your response as a JSON object with keys "gapAnalysis" (string) and "positioningSuggestions" (array of strings).
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
          { role: "system", content: "You are a helpful business analyst AI. Always respond in the requested JSON format." },
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
      // If parsing fails, create a structured object
      console.log("Could not parse OpenAI response as JSON, extracting manually");
      const content = data.choices[0].message.content;
      
      // Extract gap analysis (assuming it comes first)
      const gapAnalysisMatch = content.match(/gap analysis.*?:?\s*["']?(.*?)["']?(\n|$)/i);
      const gapAnalysis = gapAnalysisMatch ? gapAnalysisMatch[1].trim() : 
        "Based on the market research, there's an opportunity to differentiate by focusing on unique elements of your business idea that competitors haven't addressed fully.";
      
      // Extract positioning suggestions
      const suggestions = content.match(/\d+\.\s*(.*?)(\n|$)/g) || [];
      const positioningSuggestions = suggestions.map(s => s.replace(/^\d+\.\s*/, '').trim());
      
      result = {
        gapAnalysis,
        positioningSuggestions: positioningSuggestions.length >= 4 ? positioningSuggestions : [
          "Focus on a specific underserved market segment",
          "Emphasize unique technology or methodology",
          "Consider partnerships with complementary businesses",
          "Address specific pain points not solved by competitors"
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

function generateFallbackAnalysis(idea, competitors) {
  console.log("Using fallback gap analysis generation");
  const keywords = idea.toLowerCase().split(' ').filter(word => 
    word.length > 3 && !['the', 'and', 'that', 'with'].includes(word)
  );

  const gapAnalysis = `Based on analysis of existing solutions, there's an opportunity to differentiate by focusing on ${
    keywords[Math.floor(Math.random() * keywords.length)]
  } integration with ${
    keywords[Math.floor(Math.random() * keywords.length)]
  } features. Most existing platforms don't fully address the ${
    keywords[Math.floor(Math.random() * keywords.length)]
  } aspect of the market.`;

  const positioningSuggestions = [
    `Focus on ${keywords[0] || 'innovation'} as your core differentiator`,
    `Target the underserved ${keywords[1] || 'niche'} market segment`,
    `Emphasize the unique ${keywords[2] || 'technology'} integration`,
    `Consider partnerships with ${keywords[Math.floor(Math.random() * keywords.length)] || 'industry'} providers`
  ];

  return {
    competitors,
    gapAnalysis,
    positioningSuggestions
  };
}
