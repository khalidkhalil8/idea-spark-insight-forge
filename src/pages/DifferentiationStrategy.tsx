
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Users, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import StepNavigation from '@/components/StepNavigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import { supabase } from "@/integrations/supabase/client";

const DifferentiationStrategy = () => {
  const [differentiation, setDifferentiation] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Load saved differentiation strategy if any
    const savedDifferentiation = sessionStorage.getItem('differentiation');
    if (savedDifferentiation) {
      setDifferentiation(savedDifferentiation);
    }
  }, []);
  
  const handleGetSuggestions = async () => {
    const idea = sessionStorage.getItem('userIdea');
    const competitorsData = sessionStorage.getItem('competitors');
    
    if (!idea || !competitorsData) {
      toast({
        title: "Missing information",
        description: "Please complete the previous steps first.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const competitors = JSON.parse(competitorsData);
      
      // Call OpenAI through Supabase edge function for differentiator suggestions
      const { data, error } = await supabase.functions.invoke('analyze-idea', {
        body: { 
          idea, 
          competitors,
          analysisType: 'differentiation-suggestions'
        }
      });
      
      if (error) throw new Error(error.message);
      
      if (data && data.positioningSuggestions) {
        // Format suggestions into a nice text
        const suggestionsText = data.positioningSuggestions.join('\n\n');
        setDifferentiation(suggestionsText);
        
        toast({
          title: "Suggestions generated!",
          description: "We've generated some ideas on how to differentiate your business.",
        });
      }
    } catch (error) {
      console.error("Error generating suggestions:", error);
      toast({
        title: "Error generating suggestions",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSaveDifferentiation = () => {
    sessionStorage.setItem('differentiation', differentiation);
  };
  
  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center mb-4 bg-brand-100 text-brand-600 px-4 py-2 rounded-full">
          <Users className="w-5 h-5 mr-2" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          What Will You Do Differently?
        </h1>
        <p className="text-gray-600">
          Describe how your idea differentiates from existing solutions.
        </p>
      </div>

      <Card className="shadow-card mb-6">
        <CardContent className="p-6">
          <div className="mb-6 flex justify-between items-center">
            <label htmlFor="differentiation" className="block text-lg font-medium text-gray-700">
              Your Differentiation Strategy
            </label>
            <Button
              onClick={handleGetSuggestions}
              disabled={isGenerating}
              variant="outline"
              className="flex items-center"
            >
              <Lightbulb className="h-4 w-4 mr-1" />
              Need Help?
            </Button>
          </div>
          
          {isGenerating ? (
            <div className="py-8">
              <LoadingSpinner message="Generating differentiation ideas..." />
            </div>
          ) : (
            <Textarea 
              id="differentiation"
              value={differentiation}
              onChange={(e) => setDifferentiation(e.target.value)}
              placeholder="Describe what makes your product unique and how it addresses the gaps in the market..."
              className="min-h-[250px]"
            />
          )}
          
          <StepNavigation 
            nextPath="/validation-plan"
            isDisabled={!differentiation.trim()}
            onNext={handleSaveDifferentiation}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DifferentiationStrategy;
