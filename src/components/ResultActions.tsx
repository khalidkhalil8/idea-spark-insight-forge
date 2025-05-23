
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ExternalLink, Lightbulb } from 'lucide-react';

interface ResultActionsProps {
  onCopyResults: () => void;
}

const ResultActions: React.FC<ResultActionsProps> = ({ onCopyResults }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">
      <Button 
        variant="outline" 
        onClick={onCopyResults}
      >
        <ExternalLink className="mr-2 h-4 w-4" />
        Copy results
      </Button>
      <Button 
        variant="outline" 
        onClick={() => navigate('/validate')}
      >
        <Lightbulb className="mr-2 h-4 w-4" />
        Validate another idea
      </Button>
    </div>
  );
};

export default ResultActions;
