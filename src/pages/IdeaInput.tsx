
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { analyzeIdea } from '@/utils/ideaAnalysis';
import { useToast } from '@/hooks/use-toast';
import IdeaForm from '@/components/IdeaForm';
import { IdeaFormData } from '@/types/analysis';

const IdeaInput = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (data: IdeaFormData) => {
    setLoading(true);
    
    try {
      // Combine all form fields into a comprehensive description
      const ideaDescription = `
        Problem: ${data.problem}
        Target Market: ${data.targetMarket}
        Unique Value: ${data.uniqueValue}
        Customer Acquisition: ${data.customerAcquisition}
      `;
      
      // Analyze the idea with real APIs
      const analysis = await analyzeIdea(ideaDescription);
      
      // Store results in session storage
      sessionStorage.setItem('userIdea', JSON.stringify(data));
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
              <Activity className="w-5 h-5 mr-2" />
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
              <IdeaForm onSubmit={handleSubmit} isLoading={loading} />
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
