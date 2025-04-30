
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { CompetitorProfile } from '@/types/analysis';
import LoadingSpinner from '@/components/LoadingSpinner';

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
    if (!idea) {
      toast({
        title: "No idea found",
        description: "Please go back and enter your idea first",
        variant: "destructive",
      });
      return;
    }
    
    setIsSearching(true);
    
    try {
      // Call Supabase edge function to find competitors
      const { data, error } = await supabase.functions.invoke('analyze-idea', {
        body: { idea, analysisType: 'competitors-only' }
      });
      
      if (error) throw new Error(error.message);
      
      // Process the competitors data
      if (data && data.competitors && Array.isArray(data.competitors)) {
        // Filter out any invalid competitors (like headers or intro text)
        const validCompetitors = data.competitors.filter(
          (c: CompetitorProfile) => 
            c.name && 
            !c.name.toLowerCase().includes('here are') &&
            !c.name.toLowerCase().includes('direct competitors')
        );
        
        if (validCompetitors.length === 0) {
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
        const newCompetitors = validCompetitors.filter(
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
      } else {
        toast({
          title: "No competitors data received",
          description: "Please try again or add competitors manually.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error finding competitors:", error);
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
