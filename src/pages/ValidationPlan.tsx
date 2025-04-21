
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Activity } from 'lucide-react';
import StepNavigation from '@/components/StepNavigation';

const ValidationPlan = () => {
  const [validationPlan, setValidationPlan] = useState('');
  
  useEffect(() => {
    // Load saved validation plan if any
    const savedPlan = sessionStorage.getItem('validationPlan');
    if (savedPlan) {
      setValidationPlan(savedPlan);
    }
  }, []);
  
  const handleSaveValidationPlan = () => {
    sessionStorage.setItem('validationPlan', validationPlan);
  };
  
  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center mb-4 bg-brand-100 text-brand-600 px-4 py-2 rounded-full">
          <Activity className="w-5 h-5 mr-2" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          How Will You Validate Your Product?
        </h1>
        <p className="text-gray-600">
          Outline your plan for testing your idea with real customers before investing heavily.
        </p>
      </div>

      <Card className="shadow-card mb-6">
        <CardContent className="p-6">
          <div className="mb-6">
            <label htmlFor="validation-plan" className="block text-lg font-medium text-gray-700">
              Your Validation Plan
            </label>
            <p className="text-gray-500 text-sm">
              Describe how you'll reach potential customers, test your assumptions, and gather feedback.
            </p>
          </div>
          
          <Textarea 
            id="validation-plan"
            value={validationPlan}
            onChange={(e) => setValidationPlan(e.target.value)}
            placeholder="Example: I will create a landing page to collect email signups, conduct 10 customer interviews, and build a minimal prototype to test with early adopters..."
            className="min-h-[250px]"
          />
          
          <StepNavigation 
            nextPath="/summary"
            isDisabled={!validationPlan.trim()}
            onNext={handleSaveValidationPlan}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ValidationPlan;
