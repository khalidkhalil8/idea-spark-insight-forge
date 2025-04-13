
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export interface CompetitorProps {
  name: string;
  description: string;
  website: string;
  index?: number;
}

const CompetitorCard: React.FC<CompetitorProps> = ({ name, description, website, index }) => {
  // Format the domain for display
  const getDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch (e) {
      return url;
    }
  };

  return (
    <Card className="shadow-card hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-900">
            {index && <span className="inline-flex items-center justify-center w-6 h-6 bg-brand-100 text-brand-700 rounded-full mr-2">{index}</span>}
            {name}
          </h3>
          <a 
            href={website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-brand-600 hover:text-brand-800 transition-colors"
          >
            <ExternalLink className="h-5 w-5" />
          </a>
        </div>
        <div className="mt-1 text-sm text-gray-500">{getDomain(website)}</div>
        <p className="mt-2 text-gray-600 text-sm line-clamp-3">{description}</p>
        <a 
          href={website} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="mt-4 inline-flex items-center text-sm text-brand-600 hover:text-brand-800 transition-colors"
        >
          Visit Website
          <ExternalLink className="ml-1 h-3 w-3" />
        </a>
      </CardContent>
    </Card>
  );
};

export default CompetitorCard;
