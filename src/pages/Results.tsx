
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, Search, TrendingUp, ExternalLink, Save, AlertTriangle } from 'lucide-react';
import CompetitorCard from '@/components/CompetitorCard';
import EmailCaptureModal from '@/components/EmailCaptureModal';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
    
    // Create market gaps section based on available data
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

      {analysisResults.isOpenAiFallback && (
        <Alert variant="warning" className="mb-6 bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertTitle className="text-amber-700">OpenAI Analysis Failed</AlertTitle>
          <AlertDescription className="text-amber-600">
            {analysisResults.openAiError || "The AI analysis service encountered an error. Showing alternative analysis."}
          </AlertDescription>
        </Alert>
      )}

      <Card className="mb-8 shadow-card">
        <CardContent className="p-6">
          <h2 className="text-xl font-medium mb-3 flex items-center text-gray-900">
            <Lightbulb className="mr-2 h-5 w-5 text-brand-600" />
            Your Idea
          </h2>
          <div className="bg-gray-50 rounded-lg p-4 text-gray-800 border border-gray-100">
            {userIdea}
          </div>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-900">
        <TrendingUp className="mr-2 h-6 w-6 text-brand-600" />
        Market Gap Analysis
      </h2>

      <Card className="mb-8 shadow-card border-l-4 border-l-brand-500">
        <CardContent className="p-6">
          {analysisResults.marketGaps ? (
            <div className="space-y-4">
              {analysisResults.marketGaps.map((gap, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-gray-700">{gap}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-700 leading-relaxed">
              {analysisResults.gapAnalysis}
            </p>
          )}
          
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="font-medium text-gray-900 mb-3">Positioning Suggestions</h3>
            <ul className="space-y-3">
              {analysisResults.positioningSuggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 w-5 h-5 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center mr-2 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-900">
        <Search className="mr-2 h-6 w-6 text-brand-600" />
        Similar Companies & Products
      </h2>
      <div className="grid sm:grid-cols-2 gap-6 mb-10">
        {analysisResults.competitors.map((competitor) => (
          <CompetitorCard key={competitor.name} {...competitor} />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">
        <Button 
          onClick={() => setIsEmailModalOpen(true)}
          className="bg-brand-600 hover:bg-brand-700 gap-2"
        >
          <Save className="h-4 w-4" />
          Save this analysis
        </Button>
        <Button 
          variant="outline" 
          onClick={handleCopyResults}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Copy results
        </Button>
        <Button 
          variant="outline" 
          onClick={() => navigate('/validate')}
        >
          <Lightbulb className="mr-2 h-4 w-4" />
          Validate another idea
        </Button>
      </div>

      <EmailCaptureModal 
        open={isEmailModalOpen} 
        onOpenChange={setIsEmailModalOpen} 
      />
    </div>
  );
};

export default Results;
