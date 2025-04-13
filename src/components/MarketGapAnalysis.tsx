
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface MarketGapAnalysisProps {
  marketGaps?: string[];
  gapAnalysis?: string;
  positioningSuggestions: string[];
}

const MarketGapAnalysis: React.FC<MarketGapAnalysisProps> = ({ 
  marketGaps, 
  gapAnalysis, 
  positioningSuggestions 
}) => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-900">
        <TrendingUp className="mr-2 h-6 w-6 text-brand-600" />
        Market Gap Analysis
      </h2>

      <Card className="mb-8 shadow-card border-l-4 border-l-brand-500">
        <CardContent className="p-6">
          {marketGaps ? (
            <div className="space-y-4">
              {marketGaps.map((gap, index) => (
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
              {gapAnalysis || "Unable to generate market gap analysis."}
            </p>
          )}
          
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="font-medium text-gray-900 mb-3">Positioning Suggestions</h3>
            <ul className="space-y-3">
              {positioningSuggestions.map((suggestion, index) => (
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
    </>
  );
};

export default MarketGapAnalysis;
