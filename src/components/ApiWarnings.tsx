
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ApiWarningsProps {
  isOpenAiFallback?: boolean;
  openAiError?: string;
  serpApiError?: string;
  searchQuery?: string;
}

const ApiWarnings: React.FC<ApiWarningsProps> = ({
  isOpenAiFallback,
  openAiError,
  serpApiError,
  searchQuery
}) => {
  return (
    <>
      {isOpenAiFallback && (
        <Alert variant="warning" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>OpenAI Analysis Failed</AlertTitle>
          <AlertDescription>
            {openAiError || "OpenAI API not responding—please try again."}
          </AlertDescription>
        </Alert>
      )}

      {serpApiError && (
        <Alert variant="warning" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Competitor Search Issue</AlertTitle>
          <AlertDescription>
            {serpApiError || "Unable to find relevant competitors—using fallbacks."}
          </AlertDescription>
        </Alert>
      )}

      {searchQuery && (
        <Alert variant="default" className="mb-6">
          <AlertDescription>
            Search query used: "{searchQuery}"
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default ApiWarnings;
