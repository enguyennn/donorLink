import React, { useState, useMemo, useEffect } from 'react';
import { Need, Shelter, ItemType, Urgency, Status } from '../types';
import ShelterNeedCard from '../components/ShelterNeedCard';
import MapComponent from '../components/MapComponent';
import { MapIcon, ListIcon, SearchIcon, ItemIcon, Squares2x2Icon, FlameIcon, MapPinIcon } from '../components/icons';

interface DonorDashboardPageProps {
  needs: Need[];
  shelters: Shelter[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  startFulfillNeed: (need: Need) => void;
}

const DonorDashboardPage: React.FC<DonorDashboardPageProps> = ({ needs, shelters, searchTerm, setSearchTerm, startFulfillNeed }) => {
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [filters, setFilters] = useState<{ itemType: ItemType | 'all'; urgency: Urgency | 'all' }>({
    itemType: 'all',
    urgency: 'all',
  });
  const [sortBy, setSortBy] = useState<'urgency' | 'distance'>('urgency');
  const [view, setView] = useState<'list' | 'map'>('list');

  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(localSearch);
  };
  
  const itemTypes: (ItemType | 'all')[] = ['all', ...Object.values(ItemType)];
  const urgencyLevels: (Urgency | 'all')[] = ['all', ...Object.values(Urgency).reverse()];


  const filteredAndSortedNeeds = useMemo(() => {
    let filtered = needs.filter(need => need.status === Status.Active);

    if (searchTerm) {
      filtered = filtered.filter(need =>
        need.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        need.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        need.itemType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.itemType !== 'all') {
      filtered = filtered.filter(need => need.itemType === filters.itemType);
    }

    if (filters.urgency !== 'all') {
      filtered = filtered.filter(need => need.urgency === filters.urgency);
    }

    if (sortBy === 'urgency') {
      const urgencyOrder = { [Urgency.High]: 1, [Urgency.Medium]: 2, [Urgency.Low]: 3 };
      filtered.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);
    } else {
        // Mock distance sort
        filtered.sort((a, b) => a.shelterId.localeCompare(b.shelterId));
    }

    return filtered;
  }, [needs, searchTerm, filters, sortBy]);
  
  const ViewToggle = () => (
    <div className="lg:hidden fixed bottom-4 right-4 z-40">
        <div className="flex items-center bg-white rounded-full shadow-lg border">
            <button onClick={() => setView('list')} className={`p-3 rounded-l-full transition-colors ${view === 'list' ? 'bg-brand-pink text-white' : 'text-gray-600'}`}>
                <ListIcon className="h-6 w-6" />
            </button>
            <button onClick={() => setView('map')} className={`p-3 rounded-r-full transition-colors ${view === 'map' ? 'bg-brand-pink text-white' : 'text-gray-600'}`}>
                <MapIcon className="h-6 w-6" />
            </button>
        </div>
    </div>
  );

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900">Find a Need to Fulfill</h1>
            <p className="mt-4 text-lg text-gray-600">Browse the map and list below to find how you can help shelters in your area.</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8 max-w-2xl mx-auto flex">
            <label htmlFor="dashboard-search" className="sr-only">Search again</label>
            <input
              type="text"
              id="dashboard-search"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full px-5 py-3 placeholder-gray-500 focus:ring-brand-pink focus:border-brand-pink border-gray-300 rounded-l-md shadow-sm"
              placeholder="e.g. 'jackets', 'canned food', 'blankets'"
            />
            <button
              type="submit"
              className="bg-brand-pink text-white px-6 py-3 border border-transparent rounded-r-md font-medium hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-pink transition-colors flex items-center"
            >
              <SearchIcon className="h-5 w-5 mr-2 -ml-1" />
              Search
            </button>
        </form>

        {/* Filters and Sorting */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8 sticky top-[65px] z-30 space-y-6">
          {/* Category Filters */}
          <div>
            <label className="text-sm font-semibold text-gray-500 mb-2 block">Category</label>
            <div className="flex flex-wrap gap-2">
              {itemTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setFilters(prev => ({...prev, itemType: type}))}
                  className={`px-4 py-2 text-sm font-medium rounded-full flex items-center gap-2 transition-all duration-200 border-2 ${
                    filters.itemType === type 
                    ? 'bg-brand-pink text-white border-brand-pink shadow-md' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-brand-pink hover:text-brand-pink'
                  }`}
                >
                  {type === 'all' ? <Squares2x2Icon className="h-5 w-5"/> : <ItemIcon itemType={type as ItemType} className="h-5 w-5"/>}
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Urgency Filters */}
            <div>
              <label className="text-sm font-semibold text-gray-500 mb-2 block">Urgency Level</label>
              <div className="flex flex-wrap gap-2">
                {urgencyLevels.map(level => {
                  const urgencyStyles = {
                      [Urgency.High]: 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100',
                      [Urgency.Medium]: 'border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100',
                      [Urgency.Low]: 'border-green-300 bg-green-50 text-green-700 hover:bg-green-100',
                      'all': 'border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100',
                  };
                  const activeUrgencyStyles = {
                        [Urgency.High]: 'bg-red-500 text-white border-red-500',
                        [Urgency.Medium]: 'bg-yellow-500 text-white border-yellow-500',
                        [Urgency.Low]: 'bg-green-500 text-white border-green-500',
                        'all': 'bg-gray-700 text-white border-gray-700',
                  };
                  return (
                    <button
                      key={level}
                      onClick={() => setFilters(prev => ({...prev, urgency: level}))}
                      className={`px-4 py-2 text-sm font-semibold rounded-full border transition-colors ${
                          filters.urgency === level ? activeUrgencyStyles[level] : urgencyStyles[level]
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Sort controls */}
            <div>
              <label className="text-sm font-semibold text-gray-500 mb-2 block">Sort By</label>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setSortBy('urgency')} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-colors border-2 min-w-[120px] ${sortBy === 'urgency' ? 'bg-brand-pink text-white border-brand-pink shadow' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-pink hover:text-brand-pink'}`}>
                    <FlameIcon className="h-5 w-5" />
                    Urgency
                </button>
                <button onClick={() => setSortBy('distance')} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-colors border-2 min-w-[120px] ${sortBy === 'distance' ? 'bg-brand-pink text-white border-brand-pink shadow' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-pink hover:text-brand-pink'}`}>
                    <MapPinIcon className="h-5 w-5" />
                    Distance
                </button>
              </div>
            </div>
          </div>
        </div>


        <ViewToggle />

        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            <div className={`${view === 'map' ? 'block' : 'hidden'} lg:block h-96 lg:h-[calc(100vh-220px)] lg:sticky lg:top-[260px] rounded-lg overflow-hidden shadow-lg z-20`}>
                <MapComponent shelters={shelters} needs={filteredAndSortedNeeds} />
            </div>

            <div className={`${view === 'list' ? 'block' : 'hidden'} lg:block`}>
                <div className="grid gap-8 md:grid-cols-1">
                {filteredAndSortedNeeds.length > 0 ? (
                    filteredAndSortedNeeds.map(need => {
                    const shelter = shelters.find(s => s.id === need.shelterId);
                    if (!shelter) return null;
                    return <ShelterNeedCard key={need.id} need={need} shelter={shelter} onFulfill={() => startFulfillNeed(need)} />;
                    })
                ) : (
                    <div className="col-span-full text-center py-16 bg-white rounded-lg shadow-md">
                        <h3 className="text-2xl font-semibold text-gray-700">No matching needs found.</h3>
                        <p className="text-gray-500 mt-2">Try adjusting your filters or check back later!</p>
                    </div>
                )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboardPage;