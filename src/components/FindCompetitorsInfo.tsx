
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Search, Info } from 'lucide-react';

const FindCompetitorsInfo = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="p-0 h-8 w-8 rounded-full"
          aria-label="Learn more about competition analysis"
        >
          <Info className="h-5 w-5 text-gray-500 hover:text-brand-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-brand-600" />
            Finding Competition
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-sm text-gray-600">
          Our AI will analyze your idea and find competition in your market. Understanding existing solutions
          helps you identify gaps and opportunities for your product.
        </DialogDescription>
        <div className="bg-blue-50 p-3 rounded-md border border-blue-100 mt-2">
          <p className="text-sm text-blue-700">
            <strong>Tip:</strong> You can also manually add competitors if you already know them.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FindCompetitorsInfo;
