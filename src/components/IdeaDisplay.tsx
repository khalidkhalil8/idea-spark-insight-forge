
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import { IdeaFormData } from '@/types/analysis';

interface IdeaDisplayProps {
  userIdea: IdeaFormData;
}

const IdeaDisplay: React.FC<IdeaDisplayProps> = ({ userIdea }) => {
  const sections = [
    { title: 'Problem', content: userIdea.problem },
    { title: 'Target Market', content: userIdea.targetMarket },
    { title: 'Unique Value', content: userIdea.uniqueValue },
    { title: 'Customer Acquisition', content: userIdea.customerAcquisition },
  ];

  return (
    <Card className="mb-8 shadow-card">
      <CardContent className="p-6">
        <h2 className="text-xl font-medium mb-4 flex items-center text-gray-900">
          <Lightbulb className="mr-2 h-5 w-5 text-brand-600" />
          Your Idea
        </h2>
        <div className="space-y-4">
          {sections.map(({ title, content }) => (
            <div key={title} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <h3 className="font-medium text-gray-700 mb-2">{title}</h3>
              <p className="text-gray-600">{content}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default IdeaDisplay;
