
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash2 } from 'lucide-react';
import { CompetitorProfile } from '@/types/analysis';

interface CompetitorEntryProps {
  competitor: CompetitorProfile;
  index: number;
  onChange: (index: number, updatedCompetitor: CompetitorProfile) => void;
  onRemove: (index: number) => void;
}

const CompetitorEntry: React.FC<CompetitorEntryProps> = ({ competitor, index, onChange, onRemove }) => {
  const handleChange = (field: keyof CompetitorProfile, value: string) => {
    const updatedCompetitor = { ...competitor, [field]: value };
    onChange(index, updatedCompetitor);
  };

  return (
    <div className="p-4 border rounded-lg mb-4 bg-white">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium">Competitor #{index + 1}</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onRemove(index)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor={`competitor-name-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <Input
            id={`competitor-name-${index}`}
            value={competitor.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Competitor name"
          />
        </div>
        
        <div>
          <label htmlFor={`competitor-website-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
            Website
          </label>
          <Input
            id={`competitor-website-${index}`}
            value={competitor.website}
            onChange={(e) => handleChange('website', e.target.value)}
            placeholder="https://example.com"
          />
        </div>
        
        <div>
          <label htmlFor={`competitor-description-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <Textarea
            id={`competitor-description-${index}`}
            value={competitor.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="What does this competitor do?"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default CompetitorEntry;
