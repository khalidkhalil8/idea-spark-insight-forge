export interface IdeaFormData {
  problem: string;
  targetMarket: string;
  uniqueValue: string;
  customerAcquisition: string;
}

export interface CompetitorProfile {
  name: string;
  description: string;
  website: string;
}

export interface ScoreBreakdown {
  problem: number;
  targetMarket: number;
  uniqueValue: number;
  customerAcquisition: number;
  maxScores: {
    problem: number;
    targetMarket: number;
    uniqueValue: number;
    customerAcquisition: number;
  };
}

export interface AnalysisResult {
  competitors: CompetitorProfile[];
  marketGaps?: string[];
  gapAnalysis?: string;
  positioningSuggestions: string[];
  validationScore: number;
  scoreBreakdown: ScoreBreakdown;
  strengths: string[];
  weaknesses: string[];
  isOpenAiFallback?: boolean;
  openAiError?: string;
  serpApiError?: string;
}
