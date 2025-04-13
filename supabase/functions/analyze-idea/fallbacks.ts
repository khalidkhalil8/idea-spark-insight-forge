
import { Competitor, AnalysisResult } from "./utils.ts";

export function generateFallbackCompetitors(idea: string): Competitor[] {
  console.log("Using fallback competitor generation");
  const keywords = idea.toLowerCase().split(' ').filter(word => 
    word.length > 3 && !['the', 'and', 'that', 'with', 'this', 'for', 'from'].includes(word)
  );

  function generateCompanyName(idea: string): string {
    const words = idea.toLowerCase().split(' ');
    const relevantWords = words.filter(word => 
      word.length > 3 && !['the', 'and', 'that', 'with', 'this', 'for', 'from'].includes(word)
    );
    
    if (relevantWords.length >= 2) {
      // Try to make a more natural company name combining words
      return (relevantWords[0].charAt(0).toUpperCase() + relevantWords[0].slice(1)) + 
             (relevantWords[1].charAt(0).toUpperCase() + relevantWords[1].slice(1));
    }
    return relevantWords[0].charAt(0).toUpperCase() + relevantWords[0].slice(1) + "Hub";
  }

  // Create more specific company names based on the idea
  const nameSuffixes = ['Pro', 'Go', 'Now', 'Plus', 'Tech'];
  return Array.from({ length: 5 }, (_, index) => {
    const baseName = generateCompanyName(idea);
    const name = `${baseName}${nameSuffixes[index]}`;
    
    // Create more specific descriptions
    const keywordIndex1 = Math.floor(Math.random() * keywords.length);
    const keywordIndex2 = (keywordIndex1 + 1) % keywords.length;
    const keywordIndex3 = (keywordIndex1 + 2) % keywords.length;
    
    const description = `A comprehensive ${keywords[keywordIndex1] || 'business'} platform that specializes in ${
      keywords[keywordIndex2] || 'solutions'
    } for ${keywords[keywordIndex3] || 'businesses'} in the ${idea} space.`;
    
    return {
      name,
      description,
      website: `https://${name.toLowerCase().replace(/\s+/g, '')}.com`
    };
  });
}

export function generateFallbackAnalysis(idea: string, competitors: Competitor[]): AnalysisResult {
  console.log("Using fallback gap analysis generation for idea:", idea);
  const keywords = idea.toLowerCase().split(' ').filter(word => 
    word.length > 3 && !['the', 'and', 'that', 'with', 'this', 'for', 'from'].includes(word)
  );

  // Create more specific market gaps based on the idea keywords
  const marketGaps = [
    `Lack of affordable ${keywords[0] || 'solutions'} for small businesses needing ${keywords[1] || 'tools'} with professional-grade features`,
    `No integrated platform that combines ${keywords[0] || 'solutions'} with ${keywords[1] || 'management'} in a single, user-friendly interface`,
    `Absence of specialized ${keywords.length > 2 ? keywords[2] : keywords[0] || 'tools'} designed specifically for ${idea} that prioritize ease of use`
  ];

  // Create more specific positioning suggestions based on the market gaps and competitors
  const positioningSuggestions = [
    `Position as the only ${keywords[0] || 'solution'} built specifically for ${keywords[1] || 'users'} who need simplicity without sacrificing features`,
    `Emphasize your integrated approach to ${keywords[2] || 'management'} that ${competitors[0]?.name || 'competitors'} don't provide`,
    `Highlight your focus on user experience and automation compared to complex solutions like ${competitors[1]?.name || 'existing options'}`
  ];

  return {
    competitors,
    marketGaps,
    positioningSuggestions
  };
}
