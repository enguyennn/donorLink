
import React from 'react';
import { Page, Shelter } from '../types';
import { LogoIcon } from './icons';

interface HeaderProps {
  setCurrentPage: (page: Page) => void;
  loggedInShelter: Shelter | null;
  logout: () => void;
}

const Header: React.FC<HeaderProps> = ({ setCurrentPage, loggedInShelter, logout }) => {
  const NavLink: React.FC<{ page: Page; children: React.ReactNode }> = ({ page, children }) => (
    <button
      onClick={() => setCurrentPage(page)}
      className="text-gray-600 hover:text-brand-pink transition-colors duration-300 px-3 py-2 rounded-md text-sm font-medium"
    >
      {children}
    </button>
  );

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button onClick={() => setCurrentPage('home')} className="flex-shrink-0 flex items-center gap-2">
              <LogoIcon className="h-8 w-8 text-brand-pink" />
              <span className="font-bold text-xl text-gray-800">DonorLink</span>
            </button>
          </div>
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink page="home">Home</NavLink>
              <NavLink page="impact">Impact</NavLink>
              <NavLink page="contact">Contact</NavLink>
              {loggedInShelter ? (
                 <>
                    <NavLink page="shelterDashboard">My Dashboard</NavLink>
                    <button onClick={logout} className="text-gray-600 hover:text-brand-pink transition-colors duration-300 px-3 py-2 rounded-md text-sm font-medium">Logout</button>
                 </>
              ) : (
                <button
                    onClick={() => setCurrentPage('shelterLogin')}
                    className="ml-4 bg-brand-pink text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-pink-600 transition-transform transform hover:scale-105"
                >
                    For Shelters
                </button>
              )}
            </div>
          </nav>
           <div className="md:hidden">
              {/* Mobile menu button can be added here */}
           </div>
        </div>
      </div>
    </header>
  );
};

export default Header;