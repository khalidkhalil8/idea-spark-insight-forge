
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CompetitorProfile } from '@/types/analysis';
import LoadingSpinner from '@/components/LoadingSpinner';
import { searchForCompetitors } from '@/utils/competitorSearch';

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

  const handleFindCompetitors = async () => {
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
