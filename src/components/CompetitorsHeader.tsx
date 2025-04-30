
import React from 'react';
import { Search } from 'lucide-react';
import FindCompetitorsInfo from '@/components/FindCompetitorsInfo';

const CompetitorsHeader: React.FC = () => {
  return (
    <div className="text-center mb-10">
      <div className="inline-flex items-center justify-center mb-4 bg-brand-100 text-brand-600 px-4 py-2 rounded-full">
        <Search className="w-5 h-5 mr-2" />
      </div>
      <div className="flex items-center justify-center gap-2 mb-3">
        <h1 className="text-3xl font-bold text-gray-900">
          Finding Current Solutions
        </h1>
        <FindCompetitorsInfo />
      </div>
      <p className="text-gray-600">
        Add competitors to your idea or let us find them for you.
      </p>
    </div>
  );
};

export default CompetitorsHeader;
