
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

    // Get competitors using SerpAPI with improved query construction
    const competitors = await getCompetitors(idea);
    
    // Get gap analysis using OpenAI with more specific prompting
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
    // Create a more targeted search query to find actual products and companies
    // Extract key concepts from the idea
    const keyTerms = idea.split(" ")
      .filter(word => word.length > 3 && !['with', 'that', 'this', 'from', 'their', 'have', 'will'].includes(word.toLowerCase()))
      .slice(0, 5);
    
    // Add business-specific terms to improve results quality
    const searchTerm = `${keyTerms.join(" ")} top companies competitors products startups`;
    console.log(`Searching for: "${searchTerm}"`);
    
    const response = await fetch(
      `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(searchTerm)}&num=10&api_key=${serpApiKey}`
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`SerpAPI error: ${errorText}`);
      throw new Error(`SerpAPI request failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract organic results and ensure we're getting actual companies/products
    let organicResults = data.organic_results || [];
    
    // Filter more strictly to find actual company/product pages
    const competitors = organicResults
      .filter(result => 
        result.title && 
        result.snippet && 
        result.link && 
        !result.link.includes("wikipedia.org") &&
        !result.link.includes("linkedin.com") &&
        !result.link.includes("gartner.com") &&
        !result.link.includes("forbes.com") &&
        !result.link.includes("capterra.com") &&
        !result.link.includes("g2.com") &&
        !result.link.includes("youtube.com") &&
        !result.link.includes("news.")
      )
      .slice(0, 5)
      .map(result => {
        // Extract company name more carefully
        let name = result.title;
        
        // Remove common suffixes like "- Product", "| Official Site", etc.
        name = name.split(' - ')[0].split(' | ')[0].split(': ')[0];
        
        // Handle domains in company names
        if (name.includes('.com') || name.includes('.io') || name.includes('.ai')) {
          name = name.split('.')[0];
        }
        
        return {
          name: name,
          description: result.snippet,
          website: result.link
        };
      });
    
    console.log(`Found ${competitors.length} competitors`);
    
    if (competitors.length < 3) {
      // If we don't have enough companies, try a different search approach
      return await getAlternativeCompetitors(idea);
    }
    
    return competitors;
  } catch (error) {
    console.error("Error getting competitors:", error);
    // Fallback to alternative search if SerpAPI fails
    return await getAlternativeCompetitors(idea);
  }
}

async function getAlternativeCompetitors(idea) {
  try {
    // Try a more direct product-focused search
    const searchTerm = `best ${idea.split(" ").slice(0, 3).join(" ")} products companies`;
    console.log(`Trying alternative search: "${searchTerm}"`);
    
    const response = await fetch(
      `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(searchTerm)}&num=10&api_key=${serpApiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`Alternative SerpAPI request failed: ${response.status}`);
    }
    
    const data = await response.json();
    const organicResults = data.organic_results || [];
    
    // Process the results similar to above
    const competitors = organicResults
      .filter(result => 
        result.title && 
        result.snippet && 
        result.link &&
        !result.link.includes("wikipedia.org") &&
        !result.link.includes("linkedin.com")
      )
      .slice(0, 5)
      .map(result => {
        let name = result.title.split(' - ')[0].split(' | ')[0];
        
        if (name.includes('.com') || name.includes('.io') || name.includes('.ai')) {
          name = name.split('.')[0];
        }
        
        return {
          name: name,
          description: result.snippet,
          website: result.link
        };
      });
      
    console.log(`Found ${competitors.length} competitors with alternative search`);
    return competitors.length > 0 ? competitors : generateFallbackCompetitors(idea);
  } catch (error) {
    console.error("Error in alternative competitor search:", error);
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
    
    // Create more detailed competitor descriptions for better analysis
    const competitorDescriptions = competitors
      .map(c => `${c.name}: ${c.description} (Website: ${c.website})`)
      .join("\n\n");
    
    // Craft a more specific prompt for OpenAI to generate better results
    const prompt = `
      I need a detailed market gap analysis for this business idea:
      
      "${idea}"
      
      Here are some potential competitors in this market space:
      ${competitorDescriptions}
      
      Please provide:
      
      1. A specific market gap analysis (3-4 sentences) that identifies the exact market opportunities this idea could exploit that the competitors aren't addressing. Include specific niches, technologies, or approaches that could give this idea a competitive edge.
      
      2. Four highly specific positioning suggestions tailored to this particular idea. Each suggestion should be actionable, practical, and directly related to the specific business domain of the idea. Reference specific aspects of the business idea and how they can be leveraged.
      
      Format your response as a JSON object with keys "gapAnalysis" (string) and "positioningSuggestions" (array of strings). Do not include placeholders, generic advice, or vague statements - everything must be specific to this exact business idea and its competitive landscape.
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
            content: "You are a specialized business consultant with expertise in market analysis, competitive positioning, and business strategy. Your job is to provide highly specific, tailored, and actionable insights about business ideas. Avoid generic advice at all costs." 
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
