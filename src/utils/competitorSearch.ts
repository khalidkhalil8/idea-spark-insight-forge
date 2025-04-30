
import { supabase } from "@/integrations/supabase/client";
import { CompetitorProfile } from "@/types/analysis";
import { useToast } from "@/hooks/use-toast";

/**
 * Searches for competitors based on the user's idea
 * @returns Array of CompetitorProfile objects or error
 */
export const searchForCompetitors = async (idea: string | null): Promise<{
  competitors: CompetitorProfile[] | null;
  error: Error | null;
}> => {
  if (!idea) {
    return {
      competitors: null,
      error: new Error("No idea found. Please go back and enter your idea first")
    };
  }
  
  try {
    // Call Supabase edge function to find competitors
    const { data, error } = await supabase.functions.invoke('analyze-idea', {
      body: { idea, analysisType: 'competitors-only' }
    });
    
    if (error) throw new Error(error.message);
    
    // Process the competitors data
    if (data && data.competitors && Array.isArray(data.competitors)) {
      // Filter out any invalid competitors (like headers or intro text)
      const validCompetitors = data.competitors.filter(
        (c: CompetitorProfile) => 
          c.name && 
          !c.name.toLowerCase().includes('here are') &&
          !c.name.toLowerCase().includes('direct competitors')
      );
      
      if (validCompetitors.length === 0) {
        return {
          competitors: [],
          error: new Error("No valid competitors found. Try adding some manually or refining your idea description.")
        };
      }
      
      return {
        competitors: validCompetitors,
        error: null
      };
    } else {
      return {
        competitors: null,
        error: new Error("No competitors data received. Please try again or add competitors manually.")
      };
    }
  } catch (error) {
    console.error("Error finding competitors:", error);
    return {
      competitors: null,
      error: error instanceof Error ? error : new Error("An unknown error occurred")
    };
  }
};
