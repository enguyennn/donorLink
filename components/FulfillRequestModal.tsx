import React, { useState } from 'react';
import { Need, Shelter } from '../types';
import { LocationMarkerIcon, XIcon, PlusIcon, MinusIcon } from './icons';

interface FulfillRequestModalProps {
  need: Need;
  shelter: Shelter;
  onClose: () => void;
  onConfirm: (quantity: number) => void;
}

const FulfillRequestModal: React.FC<FulfillRequestModalProps> = ({ need, shelter, onClose, onConfirm }) => {
  const [quantity, setQuantity] = useState(1);
  const gmapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${shelter.address}, ${shelter.city}, ${shelter.state}`)}`;

  const handleConfirm = () => {
    if (quantity > 0 && quantity <= need.quantity) {
        onConfirm(quantity);
    } else {
        alert(`Please enter a quantity between 1 and ${need.quantity}.`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full transform transition-all" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Confirm Your Donation</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
              <span className="sr-only">Close</span>
              <XIcon className="h-6 w-6" />
            </button>
          </div>
          
          <p className="text-gray-600 mb-4">You are planning to donate <span className="font-semibold text-brand-blue">{need.name}</span>.</p>
          
          <div className="mb-6">
            <label htmlFor="donation-quantity" className="block text-sm font-medium text-gray-700 text-center mb-2">How many units are you donating?</label>
            <div className="flex items-center justify-center gap-4">
                <button 
                    type="button" 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors disabled:opacity-50"
                    disabled={quantity <= 1}
                >
                    <MinusIcon className="h-5 w-5" />
                </button>
                <input
                    type="number"
                    id="donation-quantity"
                    value={quantity}
                    onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (isNaN(val)) {
                            setQuantity(1);
                        } else {
                            setQuantity(Math.max(1, Math.min(need.quantity, val)));
                        }
                    }}
                    min="1"
                    max={need.quantity}
                    className="w-20 text-center text-2xl font-bold border-gray-300 rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue"
                    required
                />
                <button 
                    type="button"
                    onClick={() => setQuantity(q => Math.min(need.quantity, q + 1))}
                    className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors disabled:opacity-50"
                    disabled={quantity >= need.quantity}
                >
                    <PlusIcon className="h-5 w-5" />
                </button>
            </div>
             <p className="text-xs text-gray-500 mt-2 text-center">Shelter is requesting {need.quantity} more.</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-bold text-gray-900">{shelter.name}</h3>
              <p className="text-sm text-gray-600">{shelter.address}, {shelter.city}, {shelter.state}</p>
              <a href={gmapsUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-2 text-sm text-brand-blue hover:underline font-semibold">
                <LocationMarkerIcon className="h-4 w-4" />
                Get Directions
              </a>
          </div>
          
          <p className="text-xs text-gray-500 mt-6">Once you confirm, the shelter will be notified. Please coordinate with them for drop-off details. Thank you for your generosity!</p>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">
            Cancel
          </button>
          <button onClick={handleConfirm} className="px-4 py-2 text-sm font-medium text-white bg-brand-green rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            Confirm Donation
          </button>
        </div>
      </div>
    </div>
  );
};

export default FulfillRequestModal;