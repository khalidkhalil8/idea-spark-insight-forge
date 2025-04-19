
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle } from 'lucide-react';
import { ScoreBreakdown } from '@/types/analysis';

interface ValidationScoreProps {
  score: number;
  strengths: string[];
  weaknesses: string[];
  scoreBreakdown: ScoreBreakdown;
}

const ValidationScore: React.FC<ValidationScoreProps> = ({ 
  score, 
  strengths = [], 
  weaknesses = [], 
  scoreBreakdown 
}) => {
  const categories = [
    { name: 'Problem Definition', score: scoreBreakdown?.problem || 0, max: scoreBreakdown?.maxScores.problem || 25 },
    { name: 'Target Market', score: scoreBreakdown?.targetMarket || 0, max: scoreBreakdown?.maxScores.targetMarket || 25 },
    { name: 'Unique Value', score: scoreBreakdown?.uniqueValue || 0, max: scoreBreakdown?.maxScores.uniqueValue || 25 },
    { name: 'Customer Acquisition', score: scoreBreakdown?.customerAcquisition || 0, max: scoreBreakdown?.maxScores.customerAcquisition || 25 },
  ];

  return (
    <Card className="mb-8 shadow-card">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <div className="inline-block bg-brand-50 rounded-full p-4 mb-4">
            <div className="text-4xl font-bold text-brand-600">
              {score}
              <span className="text-xl">/100</span>
            </div>
          </div>
          <h2 className="text-xl font-medium text-gray-900">Validation Score</h2>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Score Breakdown</h3>
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{category.name}</span>
                  <span className="font-medium">
                    {category.score}/{category.max}
                  </span>
                </div>
                <Progress value={(category.score / category.max) * 100} />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="flex items-center text-green-600 font-medium mb-2">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Strengths
            </h3>
            <ul className="space-y-2 pl-7 list-disc text-gray-600">
              {strengths && strengths.length > 0 ? (
                strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))
              ) : (
                <li>No strengths identified yet.</li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="flex items-center text-red-600 font-medium mb-2">
              <XCircle className="w-5 h-5 mr-2" />
              Areas for Improvement
            </h3>
            <ul className="space-y-2 pl-7 list-disc text-gray-600">
              {weaknesses && weaknesses.length > 0 ? (
                weaknesses.map((weakness, index) => (
                  <li key={index}>{weakness}</li>
                ))
              ) : (
                <li>No areas for improvement identified yet.</li>
              )}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ValidationScore;
