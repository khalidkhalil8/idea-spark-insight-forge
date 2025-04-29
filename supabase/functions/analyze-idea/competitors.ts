
import { Competitor } from "./utils.ts";
import { generateFallbackCompetitors } from "./fallbacks.ts";

const perplexityApiKey = Deno.env.get("PERPLEXITY_API_KEY") || "";

/**
 * Main function to get competitors for a business idea using Perplexity API
 */
export async function getCompetitors(idea: string): Promise<Competitor[]> {
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

/**
 * Query Perplexity API for competitor information
 */
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
        model: 'sonar',  // Updated from llama-3.1-sonar-small-128k-online to just sonar
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

/**
 * Parse competitor information from text response
 */
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
