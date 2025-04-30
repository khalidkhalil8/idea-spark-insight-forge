
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8 px-6 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 text-sm">
              Mogulate
            </p>
          </div>
          <div className="flex space-x-6">
            <Link to="/" className="text-gray-600 hover:text-brand-600 text-sm">
              Home
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
