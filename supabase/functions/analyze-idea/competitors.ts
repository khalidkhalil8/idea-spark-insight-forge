
import { serpApiKey, Competitor, corsHeaders } from "./utils.ts";
import { generateFallbackCompetitors } from "./fallbacks.ts";

export async function getCompetitors(idea: string): Promise<Competitor[]> {
  try {
    // Improved search query with apps keyword for better app/product results
    const searchTerm = `${idea} apps | competitors site:.com | site:.co | site:.io -inurl:(blog | article | guide | how-to | news | review | podcast | forum | wiki | login | signup | about | pricing)`;
    console.log(`Searching for competitors with query: "${searchTerm}"`);
    
    const response = await fetch(
      `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(searchTerm)}&num=15&api_key=${serpApiKey}`
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`SerpAPI error: ${errorText}`);
      throw new Error(`SerpAPI request failed: ${response.status}`);
    }
    
    const data = await response.json();
    let organicResults = data.organic_results || [];
    
    console.log(`Found ${organicResults.length} initial results from SerpAPI`);
    
    // Apply more stringent filtering for actual business websites
    let competitors = filterBusinessResults(organicResults, idea);
    
    if (competitors.length < 4) {
      // Try alternative search if not enough competitors found
      return await getAlternativeCompetitors(idea);
    }
    
    console.log(`Returning ${Math.min(competitors.length, 5)} filtered competitors`);
    return competitors.slice(0, 5);
  } catch (error) {
    console.error("Error getting competitors:", error);
    return await getAlternativeCompetitors(idea);
  }
}

async function getAlternativeCompetitors(idea: string): Promise<Competitor[]> {
  try {
    // Extract more specific keywords from the idea
    const keywords = extractKeywords(idea);
    
    // More specific focused search using core keywords and additional product terms
    const searchTerm = `${keywords.join(' ')} software | app | platform | tool | solution | product site:.com | site:.co | site:.io -inurl:(blog | news | review | guide)`;
    console.log(`Trying alternative search: "${searchTerm}"`);
    
    const response = await fetch(
      `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(searchTerm)}&num=15&api_key=${serpApiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`Alternative SerpAPI request failed: ${response.status}`);
    }
    
    const data = await response.json();
    const organicResults = data.organic_results || [];
    
    // Filter results with the business idea context
    const competitors = filterBusinessResults(organicResults, idea);
    
    console.log(`Found ${competitors.length} competitors with alternative search`);
    return competitors.length > 0 ? competitors.slice(0, 5) : generateFallbackCompetitors(idea);
  } catch (error) {
    console.error("Error in alternative competitor search:", error);
    return generateFallbackCompetitors(idea);
  }
}

function extractKeywords(idea: string): string[] {
  // List of important business-related terms that should be prioritized
  const businessTerms = ['tracking', 'validating', 'business', 'ideas', 'api', 'apis', 'ai', 
                          'assistant', 'automation', 'platform', 'analytics', 'management'];
  
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

function filterBusinessResults(results: any[], idea: string): Competitor[] {
  // Extract keywords from the idea for relevance checking
  const keywords = extractKeywords(idea);
  
  // Additional irrelevant domains to filter out
  const irrelevantDomains = [
    'wikipedia.org', 'linkedin.com', 'medium.com', 'gartner.com', 
    'forbes.com', 'capterra.com', 'g2.com', 'youtube.com', 'news.',
    'blog.', 'reddit.com', 'quora.com', 'techcrunch.com', 'github.com',
    'stackoverflow.com', 'cnn.com', 'bbc.com', 'nytimes.com', 'wsj.com',
    'marketwatch.com', 'thestreet.com', 'bloomberg.com', 'fastcompany.com',
    'entrepreneur.com', 'huffpost.com', 'businessinsider.com', 'inc.com'
  ];
  
  const irrelevantTitlePatterns = [
    'top', 'best', 'comparison', 'vs', 'versus', 'review', 'list', 'guide',
    'how to', 'tutorial', 'tips', 'trends', 'news', 'overview', 'what is'
  ];
  
  return results
    .filter(result => {
      if (!result.title || !result.snippet || !result.link) {
        return false;
      }
      
      const titleLower = result.title.toLowerCase();
      const snippetLower = result.snippet.toLowerCase();
      const linkLower = result.link.toLowerCase();
      
      // Filter out irrelevant domains
      if (irrelevantDomains.some(domain => linkLower.includes(domain))) {
        return false;
      }
      
      // Filter out irrelevant title patterns
      if (irrelevantTitlePatterns.some(pattern => titleLower.includes(pattern))) {
        return false;
      }
      
      // Check if the title or snippet contains at least one keyword from the idea
      const hasRelevantKeyword = keywords.some(kw => 
        titleLower.includes(kw) || snippetLower.includes(kw)
      );
      
      return hasRelevantKeyword;
    })
    .map(result => {
      // Extract company name more carefully
      let name = result.title;
      
      // Remove common suffixes like "- Product", "| Official Site", etc.
      name = name.split(' - ')[0].split(' | ')[0].split(': ')[0];
      
      // Remove common website suffixes
      if (name.includes('.com') || name.includes('.io') || name.includes('.ai')) {
        name = name.replace(/\.(com|io|ai|org|net)/g, '');
      }
      
      return {
        name: name.trim(),
        description: result.snippet,
        website: result.link
      };
    })
    // Sort results to prioritize those that seem most relevant to the business idea
    .sort((a, b) => {
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
