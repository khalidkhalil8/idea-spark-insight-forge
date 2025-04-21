
import React from 'react';
import { Input } from '@/components/ui/input';
import { CompetitorProfile } from '@/types/analysis';

interface GapEntryProps {
  competitor: CompetitorProfile;
  index: number;
  onChange: (index: number, gaps: string[]) => void;
}

const GapEntry: React.FC<GapEntryProps> = ({ competitor, index, onChange }) => {
  const handleAddGap = () => {
    const updatedGaps = [...(competitor.gaps || []), ''];
    onChange(index, updatedGaps);
  };

  const handleGapChange = (gapIndex: number, value: string) => {
    const updatedGaps = [...(competitor.gaps || [])];
    updatedGaps[gapIndex] = value;
    onChange(index, updatedGaps);
  };

  const handleRemoveGap = (gapIndex: number) => {
    const updatedGaps = [...(competitor.gaps || [])];
    updatedGaps.splice(gapIndex, 1);
    onChange(index, updatedGaps);
  };

  return (
    <div className="p-4 border rounded-lg mb-4 bg-white">
      <h3 className="text-lg font-medium mb-2">{competitor.name}</h3>
      <p className="text-sm text-gray-500 mb-4">{competitor.description}</p>
      
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Market Gaps:</h4>
        
        {(competitor.gaps || []).map((gap, gapIndex) => (
          <div key={gapIndex} className="flex items-center gap-2">
            <Input
              value={gap}
              onChange={(e) => handleGapChange(gapIndex, e.target.value)}
              placeholder={`Gap #${gapIndex + 1}`}
              className="flex-1"
            />
            <button
              type="button"
              onClick={() => handleRemoveGap(gapIndex)}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        ))}
        
        <button
          type="button"
          onClick={handleAddGap}
          className="text-sm text-brand-600 hover:text-brand-700 mt-2"
        >
          + Add Gap
        </button>
      </div>
    </div>
  );
};

export default GapEntry;
