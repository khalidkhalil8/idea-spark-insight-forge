
import React from 'react';
import { Search } from 'lucide-react';
import CompetitorCard from '@/components/CompetitorCard';

interface Competitor {
  name: string;
  description: string;
  website: string;
}

interface CompetitorsSectionProps {
  competitors: Competitor[];
}

const CompetitorsSection: React.FC<CompetitorsSectionProps> = ({ competitors }) => {
  // Check if we have any valid competitors (with names and websites)
  const validCompetitors = competitors.filter(comp => 
    comp.name && comp.website && comp.website !== "#"
  );
  
  return (
    <>
      <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-900">
        <Search className="mr-2 h-6 w-6 text-brand-600" />
        Competitors
      </h2>
      
      <div className="grid sm:grid-cols-2 gap-6 mb-10">
        {validCompetitors.length > 0 ? (
          validCompetitors.slice(0, 5).map((competitor, index) => (
            <CompetitorCard 
              key={`${competitor.name}-${index}`} 
              {...competitor} 
              index={index + 1} 
            />
          ))
        ) : (
          <div className="col-span-2 p-4 bg-gray-50 rounded-md text-gray-700">
            No competitors found. Try a different search term or more specific idea description.
          </div>
        )}
      </div>
    </>
  );
};

export default CompetitorsSection;
