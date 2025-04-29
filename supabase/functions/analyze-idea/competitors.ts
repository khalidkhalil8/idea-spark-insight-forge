
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

Only include real, existing companies that are direct competitors to this idea. Format the response as a clean list of competitors with their details. Do not include any irrelevant information, commentary, or non-competitor websites like blogs or newsletters.`;
    
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
        model: 'llama-3.1-sonar-medium-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a research assistant that provides accurate information about business competitors. Return only factual information about real companies that would be direct competitors to the business idea. Include company name, website URL, and a brief description for each competitor. Format the information clearly and concisely.'
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
  
  // Split the text by double newlines to separate competitors
  const sections = text.split(/\n\n+/);
  
  for (const section of sections) {
    if (!section.trim()) continue;
    
    // Try to extract company information
    let name = "";
    let website = "";
    let description = "";
    
    // Look for name pattern (usually at the beginning of a section or line)
    const nameMatch = section.match(/^[**]*([^:]+?)[**]*:/m) || 
                     section.match(/^[0-9]+\.\s+([^:]+?)(?:\s*\(|:|\n|$)/m) ||
                     section.match(/^[**]*([^**\n]+?)[**]*\s*(?:\n|$)/m);
    
    if (nameMatch) {
      name = nameMatch[1].trim();
    }
    
    // Look for website URL pattern
    const urlMatch = section.match(/(?:Website|URL|www):\s*(https?:\/\/[^\s,)"]+)/i) || 
                    section.match(/(https?:\/\/[^\s,)"]+)/);
    
    if (urlMatch) {
      website = urlMatch[1].trim();
    } else if (section.match(/[a-z0-9-]+\.[a-z]{2,}/i)) {
      // Try to find domain-like text if no explicit URL
      const domainMatch = section.match(/(?:Website|URL|Domain):\s*([a-z0-9-]+\.[a-z]{2,})/i) || 
                          section.match(/\b([a-z0-9-]+\.[a-z]{2,})\b/i);
      if (domainMatch) {
        website = `https://${domainMatch[1].trim()}`;
      }
    }
    
    // Try to extract description - look for text after company name and website
    if (name) {
      const descriptionText = section
        .replace(name, '')
        .replace(/^[0-9]+\.\s*/, '')
        .replace(/Website:.*$/m, '')
        .replace(/URL:.*$/m, '')
        .replace(/^\s*:\s*/, '')
        .replace(/^\s*\n/, '')
        .trim();
      
      description = descriptionText;
    }
    
    // Clean up name (remove numbering if present)
    name = name.replace(/^[0-9]+\.\s*/, '');
    
    // Only add if we have at least a name
    if (name) {
      competitors.push({
        name,
        website: website || "#",
        description: description || `Competitor in the ${name} space.`
      });
    }
  }
  
  // If we couldn't parse properly, try a different approach
  if (competitors.length === 0 && text.includes('name')) {
    // Try to look for structured information
    const nameMatches = text.match(/name[s]*:?\s*([^\n]+)/gi);
    const websiteMatches = text.match(/(?:website|url)[s]*:?\s*([^\n]+)/gi);
    const descriptionMatches = text.match(/description[s]*:?\s*([^\n]+)/gi);
    
    if (nameMatches) {
      for (let i = 0; i < nameMatches.length; i++) {
        const name = nameMatches[i].replace(/name[s]*:?\s*/i, '').trim();
        const website = websiteMatches && websiteMatches[i] 
          ? websiteMatches[i].replace(/(?:website|url)[s]*:?\s*/i, '').trim()
          : "#";
        const description = descriptionMatches && descriptionMatches[i]
          ? descriptionMatches[i].replace(/description[s]*:?\s*/i, '').trim()
          : `Competitor in the ${name} space.`;
        
        competitors.push({ name, website, description });
      }
    }
  }
  
  console.log(`Parsed ${competitors.length} competitors from text`);
  return competitors.slice(0, 5); // Limit to 5 competitors
}
