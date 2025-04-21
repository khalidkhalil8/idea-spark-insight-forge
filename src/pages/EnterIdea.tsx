
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Activity } from 'lucide-react';
import StepNavigation from '@/components/StepNavigation';

const EnterIdea = () => {
  const [idea, setIdea] = useState('');
  
  const handleSaveIdea = () => {
    sessionStorage.setItem('userIdea', idea);
  };
  
  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center mb-4 bg-brand-100 text-brand-600 px-4 py-2 rounded-full">
          <Activity className="w-5 h-5 mr-2" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Enter Your Idea
        </h1>
        <p className="text-gray-600">
          Describe your business idea in detail so we can help you validate it.
        </p>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-6">
          <label htmlFor="idea-description" className="block text-lg font-medium text-gray-700 mb-2">
            Describe Your Idea
          </label>
          <Textarea 
            id="idea-description"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Example: An AI-powered fitness app that analyzes workout form through the phone camera and provides real-time feedback to prevent injuries..."
            className="min-h-[200px]"
          />
          
          <StepNavigation 
            nextPath="/competitors" 
            isDisabled={!idea.trim()}
            onNext={handleSaveIdea}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EnterIdea;
