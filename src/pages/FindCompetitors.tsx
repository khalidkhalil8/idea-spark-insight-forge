import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import CompetitorEntry from '@/components/CompetitorEntry';
import StepNavigation from '@/components/StepNavigation';
import { CompetitorProfile } from '@/types/analysis';
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from '@/components/LoadingSpinner';

const FindCompetitors = () => {
  const [competitors, setCompetitors] = useState<CompetitorProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Load any previously saved competitors from session storage
    const savedCompetitors = sessionStorage.getItem('competitors');
    if (savedCompetitors) {
      try {
        setCompetitors(JSON.parse(savedCompetitors));
      } catch (e) {
        console.error("Error parsing saved competitors:", e);
      }
    }
    
    // If no competitors are saved, initialize with an empty one
    if (!savedCompetitors || JSON.parse(savedCompetitors).length === 0) {
      setCompetitors([{
        name: '',
        description: '',
        website: ''
      }]);
    }
  }, []);
  
  const handleAddCompetitor = () => {
    setCompetitors([
      ...competitors, 
      {
        name: '',
        description: '',
        website: ''
      }
    ]);
  };
  
  const handleCompetitorChange = (index: number, updatedCompetitor: CompetitorProfile) => {
    const updatedCompetitors = [...competitors];
    updatedCompetitors[index] = updatedCompetitor;
    setCompetitors(updatedCompetitors);
  };
  
  const handleRemoveCompetitor = (index: number) => {
    const updatedCompetitors = [...competitors];
    updatedCompetitors.splice(index, 1);
    setCompetitors(updatedCompetitors);
  };
  
  const handleSaveCompetitors = () => {
    // Filter out empty competitors
    const filteredCompetitors = competitors.filter(c => c.name.trim() !== '');
    sessionStorage.setItem('competitors', JSON.stringify(filteredCompetitors));
  };
  
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
      
      // Combine found competitors with user-entered ones (avoiding duplicates)
      if (data && data.competitors && Array.isArray(data.competitors)) {
        const existingNames = new Set(competitors.map(c => c.name.toLowerCase()));
        
        const newCompetitors = data.competitors.filter(
          (c: CompetitorProfile) => c.name && !existingNames.has(c.name.toLowerCase())
        );
        
        if (newCompetitors.length > 0) {
          setCompetitors([
            ...competitors.filter(c => c.name.trim() !== ''), 
            ...newCompetitors
          ]);
          
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
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center mb-4 bg-brand-100 text-brand-600 px-4 py-2 rounded-full">
          <Search className="w-5 h-5 mr-2" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Finding Current Solutions
        </h1>
        <p className="text-gray-600">
          Add competitors to your idea or let us find them for you.
        </p>
      </div>

      <Card className="shadow-card mb-6">
        <CardContent className="p-6">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Competitors</h2>
            <div>
              <Button
                onClick={handleFindCompetitors}
                disabled={isSearching}
                className="bg-brand-600 hover:bg-brand-700"
              >
                {isSearching ? "Searching..." : "Find Competitors"}
              </Button>
            </div>
          </div>
          
          {isSearching ? (
            <div className="py-8">
              <LoadingSpinner message="Searching for competitors..." />
            </div>
          ) : (
            <div className="space-y-4">
              {competitors.map((competitor, index) => (
                <CompetitorEntry
                  key={index}
                  competitor={competitor}
                  index={index}
                  onChange={handleCompetitorChange}
                  onRemove={handleRemoveCompetitor}
                />
              ))}
            </div>
          )}
          
          <div className="flex justify-between items-center mt-6">
            <Button
              variant="outline"
              onClick={handleAddCompetitor}
              className="flex items-center"
              disabled={isSearching}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add More
            </Button>
            <StepNavigation 
              nextPath="/gaps" 
              isDisabled={competitors.filter(c => c.name.trim() !== '').length === 0}
              onNext={handleSaveCompetitors}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FindCompetitors;
