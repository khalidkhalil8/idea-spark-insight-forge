
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import GapEntry from '@/components/GapEntry';
import StepNavigation from '@/components/StepNavigation';
import { CompetitorProfile } from '@/types/analysis';

const IdentifyGaps = () => {
  const [competitors, setCompetitors] = useState<CompetitorProfile[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    // Load competitors from session storage
    const savedCompetitors = sessionStorage.getItem('competitors');
    if (savedCompetitors) {
      try {
        const parsedCompetitors = JSON.parse(savedCompetitors);
        // Initialize gaps array if not present
        const competitorsWithGaps = parsedCompetitors.map((comp: CompetitorProfile) => ({
          ...comp,
          gaps: comp.gaps || []
        }));
        setCompetitors(competitorsWithGaps);
      } catch (e) {
        console.error("Error parsing saved competitors:", e);
        toast({
          title: "Error loading competitors",
          description: "Please go back to the previous step and try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "No competitors found",
        description: "Please go back and add competitors first.",
        variant: "destructive",
      });
    }
  }, [toast]);
  
  const handleGapsChange = (index: number, gaps: string[]) => {
    const updatedCompetitors = [...competitors];
    updatedCompetitors[index] = {
      ...updatedCompetitors[index],
      gaps
    };
    setCompetitors(updatedCompetitors);
  };
  
  const handleSaveGaps = () => {
    sessionStorage.setItem('competitors', JSON.stringify(competitors));
  };
  
  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center mb-4 bg-brand-100 text-brand-600 px-4 py-2 rounded-full">
          <TrendingUp className="w-5 h-5 mr-2" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Identifying Gaps
        </h1>
        <p className="text-gray-600">
          What are the market gaps in each competitor's offering?
        </p>
      </div>

      <Card className="shadow-card mb-6">
        <CardContent className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Market Gaps</h2>
            <p className="text-gray-600">
              Identify what each competitor is missing or could do better.
            </p>
          </div>
          
          {competitors.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No competitors found. Please go back and add competitors.
            </div>
          ) : (
            <div className="space-y-4">
              {competitors.map((competitor, index) => (
                <GapEntry
                  key={index}
                  competitor={competitor}
                  index={index}
                  onChange={handleGapsChange}
                />
              ))}
            </div>
          )}
          
          <StepNavigation 
            nextPath="/differentiation"
            onNext={handleSaveGaps}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default IdentifyGaps;
