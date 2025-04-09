
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-12 w-12 text-brand-600 animate-spin-slow" />
      <p className="mt-4 text-lg text-gray-600 animate-pulse-opacity">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
