
/**
 * Extracts relevant keywords from an idea description
 */
export function extractKeywords(idea: string): string[] {
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

/**
 * Identifies if the idea is fitness-related
 */
export function isFitnessIdea(idea: string): boolean {
  const fitnessKeywords = ['fitness', 'workout', 'exercise', 'training', 'gym'];
  return fitnessKeywords.some(kw => idea.toLowerCase().includes(kw));
}
