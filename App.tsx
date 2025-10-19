import React, { useState, useCallback, useMemo } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import DonorDashboardPage from './pages/DonorDashboardPage';
import ShelterLoginPage from './pages/ShelterLoginPage';
import ShelterSignUpPage from './pages/ShelterSignUpPage';
import ShelterDashboardPage from './pages/ShelterDashboardPage';
import ImpactPage from './pages/ImpactPage';
import ContactPage from './pages/ContactPage';
import FulfillRequestModal from './components/FulfillRequestModal';

import { Page, Shelter, Need, ItemType, Urgency, Status } from './types';
import { MOCK_NEEDS, MOCK_SHELTERS } from './constants';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [needs, setNeeds] = useState<Need[]>(MOCK_NEEDS);
  const [shelters, setShelters] = useState<Shelter[]>(MOCK_SHELTERS);
  const [loggedInShelter, setLoggedInShelter] = useState<Shelter | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [fulfillingNeed, setFulfillingNeed] = useState<Need | null>(null);

  const addShelter = useCallback((newShelterData: Omit<Shelter, 'id' | 'lat' | 'lng'>) => {
    const newShelter: Shelter = {
        ...newShelterData,
        id: `shelter-${Date.now()}`,
        // Mock lat/lng for new shelters
        lat: 47.6062 + (Math.random() - 0.5) * 0.1,
        lng: -122.3321 + (Math.random() - 0.5) * 0.1,
    };
    setShelters(prev => [...prev, newShelter]);
    setLoggedInShelter(newShelter);
    setCurrentPage('shelterDashboard');
  }, []);

  const addNeed = useCallback((newNeed: Omit<Need, 'id' | 'shelterId' | 'status' | 'originalQuantity'>) => {
    if (!loggedInShelter) return;
    setNeeds(prevNeeds => [
      {
        ...newNeed,
        id: `need-${Date.now()}`,
        shelterId: loggedInShelter.id,
        status: Status.Active,
        originalQuantity: newNeed.quantity,
      },
      ...prevNeeds
    ]);
  }, [loggedInShelter]);

  const updateNeed = useCallback((updatedNeed: Need) => {
    setNeeds(prevNeeds => prevNeeds.map(need => need.id === updatedNeed.id ? updatedNeed : need));
  }, []);

  const deleteNeed = useCallback((needId: string) => {
    setNeeds(prevNeeds => prevNeeds.filter(need => need.id !== needId));
  }, []);
  
  const startFulfillNeed = (need: Need) => {
    setFulfillingNeed(need);
  };
  
  const fulfillNeed = useCallback((needId: string, quantityDonated: number) => {
    const needToUpdate = needs.find(n => n.id === needId);
    if(needToUpdate) {
        const remainingQuantity = needToUpdate.quantity - quantityDonated;
        
        // Any donation moves the status to Pending and updates the remaining quantity
        updateNeed({ 
            ...needToUpdate, 
            status: Status.Pending,
            quantity: remainingQuantity 
        });

        if (remainingQuantity <= 0) {
            alert("Thank you for fulfilling this need! The shelter has been notified.");
        } else {
            alert(`Thank you for your donation of ${quantityDonated} units! The request is now pending shelter confirmation.`);
        }
        
        setFulfillingNeed(null); // Close modal on confirm
    }
  }, [needs, updateNeed]);

  const logout = () => {
    setLoggedInShelter(null);
    setCurrentPage('home');
  };

  const PageComponent = useMemo(() => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} setSearchTerm={setSearchTerm} shelters={shelters} needs={needs} startFulfillNeed={startFulfillNeed} />;
      case 'donorDashboard':
        return <DonorDashboardPage needs={needs} shelters={shelters} searchTerm={searchTerm} setSearchTerm={setSearchTerm} startFulfillNeed={startFulfillNeed}/>;
      case 'shelterLogin':
        return <ShelterLoginPage setCurrentPage={setCurrentPage} setLoggedInShelter={setLoggedInShelter} shelters={shelters} />;
      case 'shelterSignUp':
        return <ShelterSignUpPage setCurrentPage={setCurrentPage} addShelter={addShelter} />;
      case 'shelterDashboard':
        return loggedInShelter ? <ShelterDashboardPage shelter={loggedInShelter} needs={needs.filter(n => n.shelterId === loggedInShelter.id)} addNeed={addNeed} updateNeed={updateNeed} deleteNeed={deleteNeed}/> : <ShelterLoginPage setCurrentPage={setCurrentPage} setLoggedInShelter={setLoggedInShelter} shelters={shelters} />;
      case 'impact':
        return <ImpactPage needs={needs} shelters={shelters} />;
      case 'contact':
        return <ContactPage />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} setSearchTerm={setSearchTerm} shelters={shelters} needs={needs} startFulfillNeed={startFulfillNeed} />;
    }
  }, [currentPage, needs, shelters, loggedInShelter, searchTerm, addNeed, updateNeed, deleteNeed, startFulfillNeed, addShelter]);


  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800">
      <Header setCurrentPage={setCurrentPage} loggedInShelter={loggedInShelter} logout={logout} />
      <main className="flex-grow relative z-0">
        {PageComponent}
      </main>
      <Footer />
      {fulfillingNeed && shelters.find(s => s.id === fulfillingNeed.shelterId) && (
        <FulfillRequestModal
            need={fulfillingNeed}
            shelter={shelters.find(s => s.id === fulfillingNeed.shelterId)!}
            onClose={() => setFulfillingNeed(null)}
            onConfirm={(quantity) => fulfillNeed(fulfillingNeed.id, quantity)}
        />
      )}
    </div>
  );
};

export default App;