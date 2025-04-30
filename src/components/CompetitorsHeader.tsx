
import React from 'react';
import { Search } from 'lucide-react';

const CompetitorsHeader: React.FC = () => {
  return (
    <div className="mb-10">
      <div className="flex items-center mb-4">
        <div className="bg-brand-100 text-brand-600 p-2 rounded-full">
          <Search className="w-5 h-5" />
        </div>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        Finding Current Solutions
      </h1>
      <p className="text-gray-600">
        Add competitors to your idea or let us find them for you.
      </p>
    </div>
  );
};

export default CompetitorsHeader;
