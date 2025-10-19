import React from 'react';
import { Page, Shelter } from '../types';

interface ShelterLoginPageProps {
  setCurrentPage: (page: Page) => void;
  setLoggedInShelter: (shelter: Shelter) => void;
  shelters: Shelter[];
}

const ShelterLoginPage: React.FC<ShelterLoginPageProps> = ({ setCurrentPage, setLoggedInShelter, shelters }) => {
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would involve authentication.
    // Here, we'll just log in the first mock shelter.
    if (shelters.length > 0) {
      setLoggedInShelter(shelters[0]);
      setCurrentPage('shelterDashboard');
    } else {
        alert("No shelters available to log in.");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-lg rounded-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Shelter Dashboard Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access your dashboard to manage your needs.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input id="email-address" name="email" type="email" autoComplete="email" required defaultValue="demo@shelter.org" className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-brand-pink focus:border-brand-pink focus:z-10 sm:text-sm" placeholder="Email address" />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required defaultValue="password" className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-brand-pink focus:border-brand-pink focus:z-10 sm:text-sm" placeholder="Password" />
            </div>
          </div>

          <div>
            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-pink hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-pink">
              Sign in
            </button>
          </div>
        </form>
         <div className="text-sm text-center">
            <button onClick={() => setCurrentPage('shelterSignUp')} className="font-medium text-brand-pink hover:text-pink-500">
                Don't have an account? Sign up
            </button>
        </div>
         <p className="mt-2 text-center text-xs text-gray-500">
            For demo purposes, any valid email/password will work.
          </p>
      </div>
    </div>
  );
};

export default ShelterLoginPage;