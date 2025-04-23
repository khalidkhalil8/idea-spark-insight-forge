
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Copy, ArrowRight, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { CompetitorProfile } from '@/types/analysis';

const Summary = () => {
  const [idea, setIdea] = useState('');
  const [competitors, setCompetitors] = useState<CompetitorProfile[]>([]);
  const [differentiation, setDifferentiation] = useState('');
  const [validationPlan, setValidationPlan] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load all data from session storage
    const savedIdea = sessionStorage.getItem('userIdea');
    const savedCompetitors = sessionStorage.getItem('competitors');
    const savedDifferentiation = sessionStorage.getItem('differentiation');
    const savedValidationPlan = sessionStorage.getItem('validationPlan');
    
    if (savedIdea) setIdea(savedIdea);
    if (savedCompetitors) {
      try {
        setCompetitors(JSON.parse(savedCompetitors));
      } catch (e) {
        console.error("Error parsing competitors:", e);
      }
    }
    if (savedDifferentiation) setDifferentiation(savedDifferentiation);
    if (savedValidationPlan) setValidationPlan(savedValidationPlan);
  }, []);
  
  const handleCopyToClipboard = () => {
    const summaryText = generateSummaryText();
    
    navigator.clipboard.writeText(summaryText).then(() => {
      setIsCopied(true);
      toast({
        title: "Copied to clipboard!",
        description: "Your idea validation summary has been copied.",
      });
      // Reset the copied state after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
      console.error("Error copying to clipboard:", err);
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard. Please try again.",
        variant: "destructive",
      });
    });
  };
  
  const generateSummaryText = () => {
    let summary = `# Idea Validation Summary\n\n`;
    summary += `## Your Idea\n${idea}\n\n`;
    summary += `## Competitors Analysis\n`;
    competitors.forEach((competitor, index) => {
      summary += `### ${index + 1}. ${competitor.name}\n`;
      summary += `- Website: ${competitor.website}\n`;
      summary += `- Description: ${competitor.description}\n`;
      if (competitor.gaps && competitor.gaps.length > 0) {
        summary += `- Market Gaps:\n`;
        competitor.gaps.forEach(gap => {
          if (gap.trim()) {
            summary += `  * ${gap}\n`;
          }
        });
      }
      summary += '\n';
    });
    summary += `## Differentiation Strategy\n${differentiation}\n\n`;
    summary += `## Validation Plan\n${validationPlan}\n\n`;
    return summary;
  };
  
  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Summary
        </h1>
        <p className="text-gray-600">
          Review the information you've entered about your business idea.
        </p>
      </div>

      {/* Warning message */}
      <div className="flex items-center bg-yellow-50 border border-yellow-300 text-yellow-700 rounded-md px-4 py-3 mb-6">
        <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
        <span>
          <b>Warning:</b> Your data will <b>not be saved</b> if you enter a new idea. Please copy your summary if you wish to keep it!
        </span>
      </div>

      <Card className="shadow-card mb-6">
        <CardHeader>
          <CardTitle>Your Idea</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="whitespace-pre-wrap">{idea}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-card mb-6">
        <CardHeader>
          <CardTitle>Competitors ({competitors.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {competitors.length === 0 ? (
            <p className="text-gray-500">No competitors added.</p>
          ) : (
            <div className="space-y-4">
              {competitors.map((competitor, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <h3 className="font-medium">{competitor.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{competitor.website}</p>
                  <p className="text-sm mb-2">{competitor.description}</p>
                  {competitor.gaps && competitor.gaps.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium">Market Gaps:</h4>
                      <ul className="list-disc pl-5 text-sm">
                        {competitor.gaps.map((gap, gapIndex) => (
                          gap.trim() ? <li key={gapIndex}>{gap}</li> : null
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="shadow-card mb-6">
        <CardHeader>
          <CardTitle>Differentiation Strategy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="whitespace-pre-wrap">{differentiation}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-card mb-6">
        <CardHeader>
          <CardTitle>Validation Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="whitespace-pre-wrap">{validationPlan}</p>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={handleCopyToClipboard}
          className="flex items-center"
        >
          {isCopied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copy Summary
            </>
          )}
        </Button>
        
        <Button 
          className="bg-brand-600 hover:bg-brand-700"
          onClick={() => {
            // Clear sessionStorage to ensure new data entry
            sessionStorage.clear();
            navigate('/validate');
          }}
        >
          Enter a New Idea
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Summary;
