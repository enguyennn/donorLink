import React, { useState } from 'react';
import { Page, Shelter } from '../types';

interface ShelterSignUpPageProps {
  setCurrentPage: (page: Page) => void;
  addShelter: (shelterData: Omit<Shelter, 'id' | 'lat' | 'lng'>) => void;
}

const ShelterSignUpPage: React.FC<ShelterSignUpPageProps> = ({ setCurrentPage, addShelter }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    email: '',
    phone: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addShelter(formData);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-lg rounded-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create a Shelter Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join DonorLink to start posting your needs.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input name="name" type="text" required value={formData.name} onChange={handleInputChange} className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" placeholder="Shelter Name" />
            <input name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleInputChange} className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" placeholder="Contact Email Address" />
            <input name="phone" type="tel" autoComplete="tel" required value={formData.phone} onChange={handleInputChange} className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" placeholder="Contact Phone Number" />
            <input name="address" type="text" autoComplete="street-address" required value={formData.address} onChange={handleInputChange} className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" placeholder="Street Address" />
            <div className="flex gap-4">
                <input name="city" type="text" required value={formData.city} onChange={handleInputChange} className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" placeholder="City" />
                <input name="state" type="text" required value={formData.state} onChange={handleInputChange} className="appearance-none relative block w-1/2 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" placeholder="State (e.g., WA)" />
            </div>
          </div>

          <div>
            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-blue hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue">
              Sign up & Continue
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
            <button onClick={() => setCurrentPage('shelterLogin')} className="font-medium text-brand-blue hover:text-blue-500">
                Already have an account? Sign in
            </button>
        </div>
      </div>
    </div>
  );
};

export default ShelterSignUpPage;
