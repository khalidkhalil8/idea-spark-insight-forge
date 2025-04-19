import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import IdeaDisplay from '@/components/IdeaDisplay';
import ApiWarnings from '@/components/ApiWarnings';
import MarketGapAnalysis from '@/components/MarketGapAnalysis';
import CompetitorsSection from '@/components/CompetitorsSection';
import ValidationScore from '@/components/ValidationScore';
import ResultActions from '@/components/ResultActions';
import { AnalysisResult, IdeaFormData } from '@/types/analysis';

const Results = () => {
  const [userIdea, setUserIdea] = useState<IdeaFormData | null>(null);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const storedIdea = sessionStorage.getItem('userIdea');
    const storedResults = sessionStorage.getItem('analysisResults');
    
    if (!storedIdea || !storedResults) {
      navigate('/validate');
      return;
    }
    
    try {
      const parsedIdea = JSON.parse(storedIdea);
      const parsedResults = JSON.parse(storedResults);
      
      if (!parsedResults.strengths) parsedResults.strengths = [];
      if (!parsedResults.weaknesses) parsedResults.weaknesses = [];
      if (!parsedResults.validationScore && parsedResults.validationScore !== 0) parsedResults.validationScore = 50;
      if (!parsedResults.scoreBreakdown) {
        parsedResults.scoreBreakdown = {
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
        };
      }
      
      setUserIdea(parsedIdea);
      setAnalysisResults(parsedResults);
    } catch (error) {
      console.error('Error parsing stored data:', error);
      toast({
        title: "Error loading results",
        description: "There was a problem loading your results. Please try again.",
        variant: "destructive",
      });
      navigate('/validate');
    }
  }, [navigate, toast]);

  const handleCopyResults = () => {
    if (!analysisResults || !userIdea) return;
    
    const resultsText = `
      Problem: ${userIdea.problem}
      Target Market: ${userIdea.targetMarket}
      Unique Value: ${userIdea.uniqueValue}
      Customer Acquisition: ${userIdea.customerAcquisition}
      
      Validation Score: ${analysisResults.validationScore}/100
      
      Strengths:
      ${analysisResults.strengths.map(s => `- ${s}`).join('\n')}
      
      Areas for Improvement:
      ${analysisResults.weaknesses.map(w => `- ${w}`).join('\n')}
      
      Market Gaps:
      ${analysisResults.marketGaps ? analysisResults.marketGaps.map(g => `- ${g}`).join('\n') : analysisResults.gapAnalysis}
      
      Competitors:
      ${analysisResults.competitors.map(c => `- ${c.name}: ${c.description} (${c.website})`).join('\n')}
      
      Positioning Suggestions:
      ${analysisResults.positioningSuggestions.map(s => `- ${s}`).join('\n')}
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
          <Activity className="w-5 h-5 mr-2" />
        </div>
      </div>

      <ApiWarnings 
        isOpenAiFallback={analysisResults.isOpenAiFallback}
        openAiError={analysisResults.openAiError}
        serpApiError={analysisResults.serpApiError}
      />

      <IdeaDisplay userIdea={userIdea} />

      <ValidationScore 
        score={analysisResults.validationScore}
        strengths={analysisResults.strengths}
        weaknesses={analysisResults.weaknesses}
        scoreBreakdown={analysisResults.scoreBreakdown}
      />

      <MarketGapAnalysis 
        marketGaps={analysisResults.marketGaps}
        gapAnalysis={analysisResults.gapAnalysis}
        positioningSuggestions={analysisResults.positioningSuggestions}
      />

      <CompetitorsSection 
        competitors={analysisResults.competitors} 
      />

      <ResultActions 
        onCopyResults={handleCopyResults}
      />
    </div>
  );
};

export default Results;
