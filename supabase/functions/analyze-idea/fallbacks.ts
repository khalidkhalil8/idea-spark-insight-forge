
import { Competitor, AnalysisResult } from "./utils.ts";

export function generateFallbackCompetitors(idea: string): Competitor[] {
  console.log("Using fallback competitor generation");
  const keywords = idea.toLowerCase().split(' ').filter(word => 
    word.length > 3 && !['the', 'and', 'that', 'with'].includes(word)
  );

  function generateCompanyName(idea: string): string {
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

  return Array.from({ length: 5 }, (_, index) => {
    const name = generateCompanyName(idea) + ['Pro', 'Go', 'Now', 'Plus', 'Tech'][index];
    const description = `A ${keywords[Math.floor(Math.random() * keywords.length)]} platform that focuses on ${
      keywords[Math.floor(Math.random() * keywords.length)]
    } solutions for ${keywords[Math.floor(Math.random() * keywords.length)]} needs.`;
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
    word.length > 3 && !['the', 'and', 'that', 'with'].includes(word)
  );

  // Create more specific market gaps
  const marketGaps = [
    `Limited ${keywords[0] || 'solutions'} for small businesses who need affordable ${keywords[1] || 'tools'} with professional-grade features`,
    `Lack of integrated ${keywords[2] || 'systems'} that combine ${keywords[0] || 'solutions'} with ${keywords[1] || 'tools'} in a single platform`,
    `Insufficient focus on ${keywords.length > 3 ? keywords[3] : keywords[0] || 'user'} experience for non-technical users in the ${idea} space`
  ];

  // Create more specific positioning suggestions based on the market gaps
  const positioningSuggestions = [
    `Position as the only ${keywords[0] || 'solution'} built specifically for ${keywords[1] || 'users'} who struggle with complex enterprise tools`,
    `Emphasize your unique approach to ${keywords[2] || 'integration'} that competitors like ${competitors[0]?.name || 'market leaders'} don't provide`,
    `Highlight affordability and ease-of-use compared to premium solutions like ${competitors[1]?.name || 'existing options'}`
  ];

  return {
    competitors,
    marketGaps,
    positioningSuggestions
  };
}
