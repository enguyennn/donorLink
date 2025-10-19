
import React from 'react';
import StatCard from '../components/StatCard';
import { Need, Shelter, Status } from '../types';
import { ItemIcon } from '../components/icons';

interface ImpactPageProps {
    needs: Need[];
    shelters: Shelter[];
}

const partners = [
  { name: 'Gourmet Grove Restaurant', type: 'Restaurant' },
  { name: 'Citywide Food Bank', type: 'Food Bank' },
  { name: 'The Generous Table', type: 'Non-Profit' },
  { name: 'Second Harvest', type: 'Food Bank' },
  { name: 'Urban Eats Cafe', type: 'Restaurant' },
  { name: 'Community Threads', type: 'Non-Profit' },
];

const ImpactPage: React.FC<ImpactPageProps> = ({ needs, shelters }) => {
    const fulfilledNeeds = needs.filter(n => n.status === Status.Fulfilled);

    const mealsShared = fulfilledNeeds.filter(n => n.itemType === 'Food').reduce((sum, n) => sum + n.originalQuantity, 0) + 100;
    const sheltersServed = new Set(needs.map(n => n.shelterId)).size;
    const itemsDonated = fulfilledNeeds.reduce((sum, n) => sum + n.originalQuantity, 0) + 150;
    const donorsConnected = fulfilledNeeds.length * 3; // Mocking donors connected

    const recentFulfilled = fulfilledNeeds.slice(-3).reverse();

    const PartnerCard: React.FC<{ name: string, type: string }> = ({ name, type }) => (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <p className="font-bold text-gray-800">{name}</p>
            <p className="text-sm text-gray-500">{type}</p>
        </div>
    );

    const FulfilledNeedCard: React.FC<{ need: Need }> = ({ need }) => {
        const shelter = shelters.find(s => s.id === need.shelterId);
        return (
            <div className="bg-white rounded-lg shadow-md p-4 flex items-start space-x-4">
                <div className="flex-shrink-0 bg-green-100 p-3 rounded-full">
                    <ItemIcon itemType={need.itemType} className="h-6 w-6 text-brand-green" />
                </div>
                <div>
                    <p className="font-bold text-gray-900">{need.name}</p>
                    <p className="text-sm text-gray-600">
                        <span className="font-semibold">{need.originalQuantity} units</span> fulfilled for <span className="font-semibold">{shelter?.name || 'a shelter'}</span>.
                    </p>
                </div>
            </div>
        );
    };

    return (
    <>
        <div className="bg-white pt-16 sm:pt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                <h2 className="text-base font-semibold text-brand-pink tracking-wide uppercase">Our Impact</h2>
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

        <div className="bg-gray-50 py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                {/* Partners Section */}
                <section>
                    <div className="text-center">
                        <h3 className="text-3xl font-extrabold text-gray-900">Our Valued Partners</h3>
                        <p className="max-w-2xl mt-4 mx-auto text-lg text-gray-500">
                            We're grateful for the support from local businesses and organizations that help make our work possible.
                        </p>
                    </div>
                    <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {partners.map(partner => <PartnerCard key={partner.name} {...partner} />)}
                    </div>
                </section>

                {/* Recently Fulfilled Section */}
                <section>
                    <div className="text-center">
                        <h3 className="text-3xl font-extrabold text-gray-900">Recently Fulfilled Needs</h3>
                        <p className="max-w-2xl mt-4 mx-auto text-lg text-gray-500">
                            Here are some of the most recent ways our community has shown its generosity.
                        </p>
                    </div>
                    <div className="mt-12 max-w-2xl mx-auto grid grid-cols-1 gap-6">
                        {recentFulfilled.map(need => <FulfilledNeedCard key={need.id} need={need} />)}
                    </div>
                </section>
            </div>
        </div>
    </>
    );
};

export default ImpactPage;