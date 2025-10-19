
import React from 'react';
import { Need, Shelter, Urgency, ItemType } from '../types';
import { ItemIcon } from './icons';

interface ShelterNeedCardProps {
  need: Need;
  shelter: Shelter;
  onFulfill: () => void;
}

const UrgencyBadge: React.FC<{ urgency: Urgency }> = ({ urgency }) => {
  const urgencyStyles = {
    [Urgency.High]: 'bg-red-100 text-red-800',
    [Urgency.Medium]: 'bg-yellow-100 text-yellow-800',
    [Urgency.Low]: 'bg-green-100 text-green-800',
  };
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${urgencyStyles[urgency]}`}>
      {urgency} Urgency
    </span>
  );
};

const ShelterNeedCard: React.FC<ShelterNeedCardProps> = ({ need, shelter, onFulfill }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
                <div className="bg-pink-100 p-3 rounded-full">
                    <ItemIcon itemType={need.itemType} className="h-6 w-6 text-brand-pink" />
                </div>
                <div>
                    <div className="tracking-wide text-sm text-brand-pink font-semibold">{need.itemType}</div>
                    <p className="block mt-1 text-lg leading-tight font-bold text-black">{need.name}</p>
                </div>
            </div>
          <UrgencyBadge urgency={need.urgency} />
        </div>
        
        <p className="mt-4 text-gray-600">{need.description}</p>
        <div className="mt-4">
            <p className="text-gray-800 font-semibold">Quantity Needed: <span className="font-bold text-brand-pink">{need.quantity}</span></p>
        </div>
      </div>
      <div className="px-6 pb-4 pt-2 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-semibold text-gray-800">{shelter.name}</p>
                <p className="text-xs text-gray-500">{shelter.city}, {shelter.state}</p>
            </div>
            <button
                onClick={onFulfill}
                className="bg-brand-green text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-transform transform hover:scale-105"
            >
                Fulfill Request
            </button>
        </div>
      </div>
    </div>
  );
};

export default ShelterNeedCard;