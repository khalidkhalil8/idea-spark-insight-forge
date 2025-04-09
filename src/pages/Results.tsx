
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, Search, TrendingUp, ExternalLink, Save } from 'lucide-react';
import CompetitorCard, { CompetitorProps } from '@/components/CompetitorCard';
import EmailCaptureModal from '@/components/EmailCaptureModal';
import { useToast } from '@/hooks/use-toast';

// Mock data for competitors
const mockCompetitors: CompetitorProps[] = [
  {
    name: "WorkFit",
    description: "A workplace wellness app that offers daily exercise reminders and quick workout routines.",
    website: "https://workfit-example.com"
  },
  {
    name: "DeskHealth",
    description: "Platform for office workers to improve posture and prevent strain through hourly exercise breaks.",
    website: "https://deskhealth-example.com"
  },
  {
    name: "OfficeFlex",
    description: "Corporate wellness solution with gamified fitness challenges and desk exercises.",
    website: "https://officeflex-example.com"
  },
  {
    name: "RemoteWellness",
    description: "Wellness platform for distributed teams with daily fitness routines and virtual classes.",
    website: "https://remotewellness-example.com"
  }
];

// Mock market gap analysis
const mockGapAnalysis = "Based on analysis of the current competitors, there's a clear opportunity to differentiate by focusing specifically on posture detection and personalized exercise recommendations. None of the existing solutions are using real-time posture tracking to customize workout suggestions, which could be your key advantage. Additionally, the remote worker segment is growing rapidly but most fitness apps are still designed for traditional office settings or general home workouts.";

// Mock positioning suggestions
const mockPositioningSuggestions = [
  "Focus on the posture monitoring as your core differentiator",
  "Emphasize the personalization aspect based on individual working habits",
  "Target remote-first companies as potential B2B customers",
  "Consider integration with popular video conferencing tools for seamless experience"
];

const Results = () => {
  const [userIdea, setUserIdea] = useState<string>('');
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Retrieve the user's idea from session storage
    const storedIdea = sessionStorage.getItem('userIdea');
    if (!storedIdea) {
      // If no idea found, redirect back to the input page
      navigate('/validate');
      return;
    }
    setUserIdea(storedIdea);
  }, [navigate]);

  const handleCopyResults = () => {
    const resultsText = `
      My Idea: ${userIdea}
      
      Market Gap Analysis: ${mockGapAnalysis}
      
      Competitors:
      ${mockCompetitors.map(c => `- ${c.name}: ${c.description} (${c.website})`).join('\n')}
      
      Positioning Suggestions:
      ${mockPositioningSuggestions.map(s => `- ${s}`).join('\n')}
    `;
    
    navigator.clipboard.writeText(resultsText).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Results have been copied to your clipboard!",
        duration: 3000
      });
    });
  };

  if (!userIdea) {
    return null; // Will redirect in useEffect if no idea found
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

      {/* User's original idea */}
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

      {/* Market Gap Analysis */}
      <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-900">
        <TrendingUp className="mr-2 h-6 w-6 text-brand-600" />
        Market Gap Analysis
      </h2>
      <Card className="mb-8 shadow-card border-l-4 border-l-brand-500">
        <CardContent className="p-6">
          <p className="text-gray-700 leading-relaxed">
            {mockGapAnalysis}
          </p>
          
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="font-medium text-gray-900 mb-3">Positioning Suggestions</h3>
            <ul className="space-y-2">
              {mockPositioningSuggestions.map((suggestion, index) => (
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

      {/* Competitors */}
      <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-900">
        <Search className="mr-2 h-6 w-6 text-brand-600" />
        Similar Competitors
      </h2>
      <div className="grid sm:grid-cols-2 gap-6 mb-10">
        {mockCompetitors.map((competitor) => (
          <CompetitorCard key={competitor.name} {...competitor} />
        ))}
      </div>

      {/* Action buttons */}
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

      {/* Email capture modal */}
      <EmailCaptureModal 
        open={isEmailModalOpen} 
        onOpenChange={setIsEmailModalOpen} 
      />
    </div>
  );
};

export default Results;
