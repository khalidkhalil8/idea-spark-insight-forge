
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, XCircle } from 'lucide-react';

interface ValidationScoreProps {
  score: number;
  strengths: string[];
  weaknesses: string[];
}

const ValidationScore: React.FC<ValidationScoreProps> = ({ score, strengths = [], weaknesses = [] }) => {
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
