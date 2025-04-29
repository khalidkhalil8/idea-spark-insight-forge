
import { Competitor, AnalysisResult } from "./utils.ts";
import { getMarketGapAnalysis } from "./marketGapAnalysis.ts";
import { generateFallbackAnalysis } from "./fallbacks.ts";

export async function getGapAnalysis(idea: string, competitors: Competitor[]): Promise<AnalysisResult> {
  try {
    // Delegate to the specialized market gap analysis function
    return await getMarketGapAnalysis(idea, competitors);
  } catch (error) {
    console.error("Error getting gap analysis:", error);
    return generateFallbackAnalysis(idea, competitors);
  }
}
