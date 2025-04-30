
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CompetitorProfile } from '@/types/analysis';
import LoadingSpinner from '@/components/LoadingSpinner';
import { searchForCompetitors } from '@/utils/competitorSearch';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';

interface CompetitorSearchProps {
  onCompetitorsFound: (newCompetitors: CompetitorProfile[]) => void;
  existingCompetitors: CompetitorProfile[];
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;
}

const CompetitorSearch: React.FC<CompetitorSearchProps> = ({ 
  onCompetitorsFound, 
  existingCompetitors, 
  isSearching, 
  setIsSearching 
}) => {
  const { toast } = useToast();
  const [showExplanation, setShowExplanation] = useState(false);

  const handleFindCompetitors = async () => {
    setShowExplanation(true);
  };
  
  const handleConfirmSearch = async () => {
    setShowExplanation(false);
    const idea = sessionStorage.getItem('userIdea');
    
    setIsSearching(true);
    
    try {
      const { competitors, error } = await searchForCompetitors(idea);
      
      if (error) {
        toast({
          title: "Error finding competitors",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      if (!competitors || competitors.length === 0) {
        toast({
          title: "No valid competitors found",
          description: "Try adding some manually or refining your idea description.",
        });
        return;
      }
      
      // Check existing competitors to avoid duplicates
      const existingNames = new Set(
        existingCompetitors
          .filter(c => c.name.trim() !== '')
          .map(c => c.name.toLowerCase())
      );
      
      // Filter out duplicates
      const newCompetitors = competitors.filter(
        (c: CompetitorProfile) => c.name && !existingNames.has(c.name.toLowerCase())
      );
      
      if (newCompetitors.length > 0) {
        onCompetitorsFound(newCompetitors);
        
        toast({
          title: "Competitors found!",
          description: `Found ${newCompetitors.length} new competitors for your idea.`,
        });
      } else {
        toast({
          title: "No new competitors found",
          description: "Try adding some manually or refining your idea description.",
        });
      }
    } catch (error) {
      console.error("Error in handleFindCompetitors:", error);
      toast({
        title: "Error finding competitors",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <>
      <Dialog open={showExplanation} onOpenChange={setShowExplanation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-brand-600" />
              Finding Competition
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-sm text-gray-600">
            Our AI will analyze your idea and find competition in your market. Understanding existing solutions
            helps you identify gaps and opportunities for your product.
          </DialogDescription>
          <div className="bg-blue-50 p-3 rounded-md border border-blue-100 mt-2">
            <p className="text-sm text-blue-700">
              <strong>Tip:</strong> You can also manually add competitors if you already know them.
            </p>
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={handleConfirmSearch} className="bg-brand-600 hover:bg-brand-700">
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {isSearching ? (
        <div className="py-8">
          <LoadingSpinner message="Searching for competitors..." />
        </div>
      ) : (
        <Button
          onClick={handleFindCompetitors}
          disabled={isSearching}
          className="bg-brand-600 hover:bg-brand-700"
        >
          Find Competitors
        </Button>
      )}
    </>
  );
};

export default CompetitorSearch;
