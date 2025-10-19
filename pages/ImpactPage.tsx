
import React from 'react';
import StatCard from '../components/StatCard';
import { Need, Shelter, Status } from '../types';

interface ImpactPageProps {
    needs: Need[];
    shelters: Shelter[];
}

const ImpactPage: React.FC<ImpactPageProps> = ({ needs, shelters }) => {
    const mealsShared = needs.filter(n => n.itemType === 'Food' && n.status === Status.Fulfilled).reduce((sum, n) => sum + n.quantity, 0);
    const sheltersServed = new Set(needs.map(n => n.shelterId)).size;
    const itemsDonated = needs.filter(n => n.status === Status.Fulfilled).reduce((sum, n) => sum + n.quantity, 0);
    // Mocking donors connected
    const donorsConnected = needs.filter(n => n.status === Status.Fulfilled).length * 3;

  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-brand-blue tracking-wide uppercase">Our Impact</h2>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Community in Action
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            Every donation, big or small, contributes to a stronger, more caring community. Here's a look at what we've achieved together.
          </p>
        </div>
      </div>
      <div className="mt-16 max-w-7xl mx-auto grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 px-4 sm:px-6 lg:px-8">
          <StatCard label="Meals Shared" value={mealsShared} />
          <StatCard label="Shelters Served" value={sheltersServed} />
          <StatCard label="Items Donated" value={itemsDonated} />
          <StatCard label="Donors Connected" value={donorsConnected} />
      </div>
    </div>
  );
};

export default ImpactPage;
