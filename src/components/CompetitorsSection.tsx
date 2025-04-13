
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
  return (
    <>
      <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-900">
        <Search className="mr-2 h-6 w-6 text-brand-600" />
        Similar Companies & Products
      </h2>
      <div className="grid sm:grid-cols-2 gap-6 mb-10">
        {competitors.map((competitor) => (
          <CompetitorCard key={competitor.name} {...competitor} />
        ))}
      </div>
    </>
  );
};

export default CompetitorsSection;
