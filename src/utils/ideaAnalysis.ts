
import { supabase } from "@/integrations/supabase/client";

export interface CompetitorProfile {
  name: string;
  description: string;
  website: string;
}

export interface AnalysisResult {
  competitors: CompetitorProfile[];
  marketGaps?: string[];
  gapAnalysis?: string;
  positioningSuggestions: string[];
  isOpenAiFallback?: boolean;
  openAiError?: string;
}

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

    // Log the received data to help with debugging
    console.log("Analysis results:", data);
    return data as AnalysisResult;
  } catch (err) {
    console.error("Error analyzing idea:", err);
    throw err;
  }
};

