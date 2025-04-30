
import { supabase } from "@/integrations/supabase/client";
import { AnalysisResult } from "@/types/analysis";

export const analyzeIdea = async (idea: string): Promise<AnalysisResult> => {
  try {
    console.log("Analyzing idea:", idea);
    const { data, error } = await supabase.functions.invoke('analyze-idea', {
      body: { idea }
    });

    if (error) {
      console.error("Error invoking Supabase function:", error);
      throw new Error(`Analysis failed: ${error.message}`);
    }

    console.log("Analysis results:", data);
    
    // Clean up competitors data and their descriptions
    const cleanedCompetitors = Array.isArray(data.competitors) 
      ? data.competitors.map(competitor => ({
          name: competitor.name || 'Unknown',
          description: competitor.description 
            ? competitor.description
                .replace(/\*\*/g, '') // Remove all ** instances
                .replace(/\*/g, '')   // Remove all * instances
                .trim()
            : 'No description available',
          website: competitor.website && competitor.website !== '#' 
            ? competitor.website 
            : ''
        }))
      : [];
    
    // Validate and ensure required fields with score breakdown
    const result: AnalysisResult = {
      competitors: cleanedCompetitors,
      marketGaps: Array.isArray(data.marketGaps) ? data.marketGaps : undefined,
      gapAnalysis: typeof data.gapAnalysis === 'string' ? data.gapAnalysis : undefined,
      positioningSuggestions: Array.isArray(data.positioningSuggestions) ? data.positioningSuggestions : [],
      validationScore: typeof data.validationScore === 'number' ? data.validationScore : 50,
      scoreBreakdown: data.scoreBreakdown || {
        problem: 0,
        targetMarket: 0,
        uniqueValue: 0,
        customerAcquisition: 0,
        maxScores: {
          problem: 25,
          targetMarket: 25,
          uniqueValue: 25,
          customerAcquisition: 25
        }
      },
      strengths: Array.isArray(data.strengths) ? data.strengths : [],
      weaknesses: Array.isArray(data.weaknesses) ? data.weaknesses : [],
      isOpenAiFallback: data.isOpenAiFallback,
      openAiError: data.openAiError,
      serpApiError: data.serpApiError
    };
    
    return result;
  } catch (err) {
    console.error("Error analyzing idea:", err);
    
    // Return a fallback result with score breakdown
    const fallbackResult: AnalysisResult = {
      competitors: [],
      positioningSuggestions: ["Retry analysis for positioning suggestions"],
      validationScore: 0,
      scoreBreakdown: {
        problem: 0,
        targetMarket: 0,
        uniqueValue: 0,
        customerAcquisition: 0,
        maxScores: {
          problem: 25,
          targetMarket: 25,
          uniqueValue: 25,
          customerAcquisition: 25
        }
      },
      strengths: [],
      weaknesses: ["Unable to complete analysis. Please try again."]
    };
    
    return fallbackResult;
  }
};
