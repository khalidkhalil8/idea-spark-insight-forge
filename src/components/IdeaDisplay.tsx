
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface IdeaDisplayProps {
  userIdea: string;
}

const IdeaDisplay: React.FC<IdeaDisplayProps> = ({ userIdea }) => {
  return (
    <Card className="mb-8 shadow-card">
      <CardContent className="p-6">
        <h2 className="text-xl font-medium mb-3 flex items-center text-gray-900">
          <Lightbulb className="mr-2 h-5 w-5 text-brand-600" />
          Your Idea
        </h2>
        <div className="bg-gray-50 rounded-lg p-4 text-gray-800 border border-gray-100">
          {userIdea}
        </div>
      </CardContent>
    </Card>
  );
};

export default IdeaDisplay;
