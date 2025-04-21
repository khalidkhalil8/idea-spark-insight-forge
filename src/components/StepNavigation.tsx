
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface StepNavigationProps {
  nextPath: string;
  isDisabled?: boolean;
  onNext?: () => void;
}

const StepNavigation: React.FC<StepNavigationProps> = ({ nextPath, isDisabled = false, onNext }) => {
  const navigate = useNavigate();
  
  const handleNext = () => {
    if (onNext) {
      onNext();
    }
    navigate(nextPath);
  };
  
  return (
    <div className="flex justify-end mt-8">
      <Button 
        className="bg-brand-600 hover:bg-brand-700"
        onClick={handleNext}
        disabled={isDisabled}
      >
        Next
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default StepNavigation;
