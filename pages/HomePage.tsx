import React, { useState } from 'react';
import { Page, Shelter, Need } from '../types';
import ShelterNeedCard from '../components/ShelterNeedCard';
import { SearchIcon, GiftIcon, HeartIcon } from '../components/icons';
import MapComponent from '../components/MapComponent';

interface HomePageProps {
  setCurrentPage: (page: Page) => void;
  setSearchTerm: (term: string) => void;
  shelters: Shelter[];
  needs: Need[];
  startFulfillNeed: (need: Need) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setCurrentPage, setSearchTerm, shelters, needs, startFulfillNeed }) => {
    const [localSearch, setLocalSearch] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchTerm(localSearch);
        setCurrentPage('donorDashboard');
    };
    
    const recentNeeds = needs.filter(n => n.status === 'Active').slice(0, 4);
    const activeNeeds = needs.filter(n => n.status === 'Active');

  return (
    <div>
      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-slate-900/60"></div>
        <div className="relative max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            <span className="block">Connecting those who have</span>
            <span className="block text-sky-400">with those in need.</span>
          </h1>
          <p className="mt-6 max-w-lg mx-auto text-xl text-gray-200">
            DonorLink is a bridge between your generosity and the urgent needs of local shelters. Find out how you can make a difference today.
          </p>
          <form onSubmit={handleSearch} className="mt-8 max-w-xl mx-auto sm:flex">
            <label htmlFor="search" className="sr-only">Search for an item</label>
            <input
              type="text"
              name="search"
              id="search"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full px-5 py-3 placeholder-gray-500 focus:ring-brand-blue focus:border-brand-blue border-gray-300 rounded-md shadow-sm"
              placeholder="e.g. 'jackets', 'canned food', 'blankets'"
            />
            <button
              type="submit"
              className="mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto sm:flex-shrink-0 bg-brand-blue text-white px-6 py-3 border border-transparent rounded-md font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-transform transform hover:scale-105"
            >
              Find Needs
            </button>
          </form>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Making a Difference is Easy</h2>
            <p className="text-lg text-gray-500 max-w-3xl mx-auto">Follow these simple steps to support shelters and individuals in your local area.</p>
          </div>
          <div className="mt-12 grid gap-12 md:grid-cols-3">
            {/* Step 1 */}
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-blue/10 mx-auto">
                <SearchIcon className="h-8 w-8 text-brand-blue" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900">1. Find a Need</h3>
              <p className="mt-2 text-gray-600">Search for specific items or browse real-time requests from local shelters right here in our community.</p>
            </div>
            {/* Step 2 */}
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-green/10 mx-auto">
                <GiftIcon className="h-8 w-8 text-brand-green" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900">2. Fulfill a Request</h3>
              <p className="mt-2 text-gray-600">Commit to providing needed items. You'll receive information to coordinate drop-off directly with the shelter.</p>
            </div>
            {/* Step 3 */}
            <div className="text-center">
               <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mx-auto">
                <HeartIcon className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900">3. See Your Impact</h3>
              <p className="mt-2 text-gray-600">Your donation helps our neighbors in need and contributes to a stronger, more supported community.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Needs Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Recent Urgent Needs</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {recentNeeds.map(need => {
                    const shelter = shelters.find(s => s.id === need.shelterId);
                    if (!shelter) return null;
                    return <ShelterNeedCard key={need.id} need={need} shelter={shelter} onFulfill={() => startFulfillNeed(need)}/>
                })}
            </div>
             <div className="text-center mt-12">
                <button
                    onClick={() => setCurrentPage('donorDashboard')}
                    className="bg-brand-blue text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-transform transform hover:scale-105"
                >
                    View All Needs & Filters
                </button>
            </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Needs on the Map</h2>
                <p className="text-lg text-gray-500 max-w-3xl mx-auto mb-12">
                    Get a bird's-eye view of where your help is needed most. Click on a pin to see a shelter's urgent requests.
                </p>
            </div>
            <div className="h-[500px] w-full rounded-xl overflow-hidden shadow-2xl border-4 border-white">
                <MapComponent shelters={shelters} needs={activeNeeds} />
            </div>
        </div>
    </section>
    </div>
  );
};

export default HomePage;