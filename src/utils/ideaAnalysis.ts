
interface CompetitorProfile {
  name: string;
  description: string;
  website: string;
}

interface AnalysisResult {
  competitors: CompetitorProfile[];
  gapAnalysis: string;
  positioningSuggestions: string[];
}

function generateCompanyName(idea: string): string {
  // Simple name generation based on keywords in the idea
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

export const analyzeIdea = (idea: string): AnalysisResult => {
  // Extract key terms from the idea
  const keywords = idea.toLowerCase().split(' ').filter(word => 
    word.length > 3 && !['the', 'and', 'that', 'with'].includes(word)
  );

  // Generate competitors based on the idea
  const competitors = Array.from({ length: 4 }, (_, index) => {
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

  // Generate market gap analysis
  const gapAnalysis = `Based on analysis of existing solutions, there's an opportunity to differentiate by focusing on ${
    keywords[Math.floor(Math.random() * keywords.length)]
  } integration with ${
    keywords[Math.floor(Math.random() * keywords.length)]
  } features. Most existing platforms don't fully address the ${
    keywords[Math.floor(Math.random() * keywords.length)]
  } aspect of the market.`;

  // Generate positioning suggestions
  const positioningSuggestions = [
    `Focus on ${keywords[0]} as your core differentiator`,
    `Target the underserved ${keywords[1]} market segment`,
    `Emphasize the unique ${keywords[2]} integration`,
    `Consider partnerships with ${keywords[Math.floor(Math.random() * keywords.length)]} providers`
  ];

  return {
    competitors,
    gapAnalysis,
    positioningSuggestions
  };
};
