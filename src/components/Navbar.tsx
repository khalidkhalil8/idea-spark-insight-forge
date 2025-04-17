
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Activity } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="border-b border-gray-200 py-4 px-6 bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Activity className="h-6 w-6 text-brand-600" />
          <span className="font-bold text-xl text-gray-900">Mogulate</span>
        </Link>
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-gray-600 hover:text-brand-600 transition-colors">
            Home
          </Link>
          <Link to="/validate">
            <Button className="bg-brand-600 hover:bg-brand-700 text-white">
              Start Validating
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
