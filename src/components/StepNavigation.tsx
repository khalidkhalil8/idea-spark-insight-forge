
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StepNavigationProps {
  previousPath?: string;
  nextPath?: string;
  onPrevious?: () => void;
  onNext?: () => void;
  isDisabled?: boolean;
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  previousPath,
  nextPath,
  onPrevious,
  onNext,
  isDisabled = false
}) => {
  const navigate = useNavigate();
  
  const handlePrevious = () => {
    if (onPrevious) onPrevious();
    if (previousPath) navigate(previousPath);
  };
  
  const handleNext = () => {
    if (onNext) onNext();
    if (nextPath) navigate(nextPath);
  };
  
  return (
    <div className="flex justify-between mt-6">
      {previousPath ? (
        <Button
          variant="outline"
          onClick={handlePrevious}
          className="flex items-center"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
      ) : <div />}
      
      {nextPath && (
        <Button
          onClick={handleNext}
          disabled={isDisabled}
          className="bg-brand-600 hover:bg-brand-700 flex items-center"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      )}
    </div>
  );
};

export default StepNavigation;
