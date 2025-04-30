
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import StepNavigation from '@/components/StepNavigation';
import { CompetitorProfile } from '@/types/analysis';
import CompetitorsHeader from '@/components/CompetitorsHeader';
import CompetitorsList from '@/components/CompetitorsList';

const FindCompetitors = () => {
  const [competitors, setCompetitors] = useState<CompetitorProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
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
  
  const handleCompetitorsFound = (newCompetitors: CompetitorProfile[]) => {
    // Combine existing non-empty competitors with new ones
    const nonEmptyCompetitors = competitors.filter(c => c.name.trim() !== '');
    
    setCompetitors([
      ...nonEmptyCompetitors, 
      ...newCompetitors
    ]);
  };
  
  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <CompetitorsHeader />

      <Card className="shadow-card mb-6">
        <CardContent className="p-6">
          <CompetitorsList 
            competitors={competitors}
            onChangeCompetitor={handleCompetitorChange}
            onRemoveCompetitor={handleRemoveCompetitor}
            onAddCompetitor={handleAddCompetitor}
            isSearching={isSearching}
            setIsSearching={setIsSearching}
            onCompetitorsFound={handleCompetitorsFound}
          />
          
          <StepNavigation 
            nextPath="/differentiation" 
            isDisabled={competitors.filter(c => c.name.trim() !== '').length === 0}
            onNext={handleSaveCompetitors}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default FindCompetitors;
