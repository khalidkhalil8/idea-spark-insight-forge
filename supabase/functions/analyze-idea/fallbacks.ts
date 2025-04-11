
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

export function generateFallbackAnalysis(idea: string, competitors: Competitor[]): AnalysisResult {
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
