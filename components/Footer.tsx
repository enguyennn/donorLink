
import React from 'react';
import { LogoIcon } from './icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center gap-2">
          <LogoIcon className="h-6 w-6 text-gray-400" />
          <span className="text-gray-500">&copy; {new Date().getFullYear()} DonorLink. All rights reserved.</span>
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">Connecting communities, one donation at a time.</p>
      </div>
    </footer>
  );
};

export default Footer;
