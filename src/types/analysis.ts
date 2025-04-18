
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

export interface AnalysisResult {
  competitors: CompetitorProfile[];
  marketGaps?: string[];
  gapAnalysis?: string;
  positioningSuggestions: string[];
  validationScore: number;
  strengths: string[];
  weaknesses: string[];
  isOpenAiFallback?: boolean;
  openAiError?: string;
  serpApiError?: string;
}
