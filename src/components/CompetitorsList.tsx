
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CompetitorProfile } from '@/types/analysis';
import CompetitorEntry from '@/components/CompetitorEntry';
import CompetitorSearch from '@/components/CompetitorSearch';

interface CompetitorsListProps {
  competitors: CompetitorProfile[];
  onChangeCompetitor: (index: number, competitor: CompetitorProfile) => void;
  onRemoveCompetitor: (index: number) => void;
  onAddCompetitor: () => void;
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;
  onCompetitorsFound: (newCompetitors: CompetitorProfile[]) => void;
}

const CompetitorsList: React.FC<CompetitorsListProps> = ({
  competitors,
  onChangeCompetitor,
  onRemoveCompetitor,
  onAddCompetitor,
  isSearching,
  setIsSearching,
  onCompetitorsFound
}) => {
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Competitors</h2>
        <div>
          <CompetitorSearch
            existingCompetitors={competitors}
            onCompetitorsFound={onCompetitorsFound}
            isSearching={isSearching}
            setIsSearching={setIsSearching}
          />
        </div>
      </div>
      
      {!isSearching && (
        <div className="space-y-4">
          {competitors.map((competitor, index) => (
            <CompetitorEntry
              key={index}
              competitor={competitor}
              index={index}
              onChange={onChangeCompetitor}
              onRemove={onRemoveCompetitor}
            />
          ))}
        </div>
      )}
      
      <div className="flex justify-between items-center mt-6">
        <Button
          variant="outline"
          onClick={onAddCompetitor}
          className="flex items-center"
          disabled={isSearching}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add More
        </Button>
      </div>
    </div>
  );
};

export default CompetitorsList;
