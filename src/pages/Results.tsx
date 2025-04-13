
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import EmailCaptureModal from '@/components/EmailCaptureModal';
import IdeaDisplay from '@/components/IdeaDisplay';
import ApiWarnings from '@/components/ApiWarnings';
import MarketGapAnalysis from '@/components/MarketGapAnalysis';
import CompetitorsSection from '@/components/CompetitorsSection';
import ResultActions from '@/components/ResultActions';

interface AnalysisResults {
  competitors: {
    name: string;
    description: string;
    website: string;
  }[];
  marketGaps?: string[];
  gapAnalysis?: string;
  positioningSuggestions: string[];
  isOpenAiFallback?: boolean;
  openAiError?: string;
  serpApiError?: string;
  searchQuery?: string;
}

const Results = () => {
  const [userIdea, setUserIdea] = useState<string>('');
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const storedIdea = sessionStorage.getItem('userIdea');
    const storedResults = sessionStorage.getItem('analysisResults');
    
    if (!storedIdea || !storedResults) {
      navigate('/validate');
      return;
    }
    
    setUserIdea(storedIdea);
    setAnalysisResults(JSON.parse(storedResults));
  }, [navigate]);

  const handleCopyResults = () => {
    if (!analysisResults) return;
    
    const marketGapsText = analysisResults.marketGaps ? 
      `Market Gaps:\n${analysisResults.marketGaps.map((gap, i) => `${i+1}. ${gap}`).join('\n')}` :
      `Market Gap Analysis: ${analysisResults.gapAnalysis}`;
    
    const resultsText = `
      My Idea: ${userIdea}
      
      ${marketGapsText}
      
      Competitors:
      ${analysisResults.competitors.map(c => `- ${c.name}: ${c.description} (${c.website})`).join('\n')}
      
      Positioning Suggestions:
      ${analysisResults.positioningSuggestions.map((s, i) => `${i+1}. ${s}`).join('\n')}
    `;
    
    navigator.clipboard.writeText(resultsText).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Results have been copied to your clipboard!",
        duration: 3000
      });
    });
  };

  if (!userIdea || !analysisResults) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center mb-4 bg-brand-100 text-brand-600 px-4 py-2 rounded-full">
          <Lightbulb className="w-5 h-5 mr-2" />
          Validation Results
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Your Idea Analysis
        </h1>
      </div>

      <ApiWarnings 
        isOpenAiFallback={analysisResults.isOpenAiFallback}
        openAiError={analysisResults.openAiError}
        serpApiError={analysisResults.serpApiError}
        searchQuery={analysisResults.searchQuery}
      />

      <IdeaDisplay userIdea={userIdea} />

      <MarketGapAnalysis 
        marketGaps={analysisResults.marketGaps}
        gapAnalysis={analysisResults.gapAnalysis}
        positioningSuggestions={analysisResults.positioningSuggestions}
      />

      <CompetitorsSection competitors={analysisResults.competitors} />

      <ResultActions 
        onEmailCapture={() => setIsEmailModalOpen(true)} 
        onCopyResults={handleCopyResults}
      />

      <EmailCaptureModal 
        open={isEmailModalOpen} 
        onOpenChange={setIsEmailModalOpen} 
      />
    </div>
  );
};

export default Results;
