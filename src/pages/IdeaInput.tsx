
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, ArrowRight } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { analyzeIdea } from '@/utils/ideaAnalysis';
import { useToast } from '@/hooks/use-toast';

const IdeaInput = () => {
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;
    
    setLoading(true);
    
    try {
      // Analyze the idea with real APIs
      const analysis = await analyzeIdea(idea.trim());
      
      // Store results in session storage
      sessionStorage.setItem('userIdea', idea);
      sessionStorage.setItem('analysisResults', JSON.stringify(analysis));
      
      // Navigate to results page
      navigate('/results');
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis failed",
        description: "We couldn't analyze your idea. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      {loading ? (
        <div className="mt-12">
          <LoadingSpinner message="Analyzing market landscape..." />
        </div>
      ) : (
        <>
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center mb-4 bg-brand-100 text-brand-600 px-4 py-2 rounded-full">
              <Lightbulb className="w-5 h-5 mr-2" />
              Idea Validator
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Describe Your Business Idea
            </h1>
            <p className="text-gray-600">
              Help us understand your concept so we can find relevant competitors and opportunities.
            </p>
          </div>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label 
                    htmlFor="idea-input" 
                    className="block text-sm font-medium text-gray-700"
                  >
                    Your Business Idea
                  </label>
                  <Textarea
                    id="idea-input"
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="A fitness app for remote workers that suggests quick desk workouts based on posture."
                    className="min-h-[150px] resize-none"
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Provide enough detail for us to understand your target market and value proposition.
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    className="bg-brand-600 hover:bg-brand-700 gap-2"
                    disabled={!idea.trim()}
                  >
                    Validate My Idea
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 text-center text-gray-600 text-sm">
            <p>
              Your inputs are processed securely and never stored permanently.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default IdeaInput;
