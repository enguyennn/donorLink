
import React, { useState } from 'react';

const ContactPage: React.FC = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        <h2 className="text-3xl font-extrabold text-center text-gray-900">Get in Touch</h2>
        <p className="mt-4 text-center text-lg text-gray-500">
          Have questions or feedback? We'd love to hear from you.
        </p>
        {submitted ? (
            <div className="mt-12 text-center p-8 bg-green-50 rounded-lg">
                <h3 className="text-2xl font-bold text-green-700">Thank you!</h3>
                <p className="mt-2 text-green-600">Your message has been sent. We'll get back to you shortly.</p>
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="mt-12 space-y-6">
              <div>
                <label htmlFor="name" className="sr-only">Full name</label>
                <input type="text" name="name" id="name" autoComplete="name" required className="block w-full shadow-sm py-3 px-4 placeholder-gray-500 focus:ring-brand-blue focus:border-brand-blue border-gray-300 rounded-md" placeholder="Full name" />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input id="email" name="email" type="email" autoComplete="email" required className="block w-full shadow-sm py-3 px-4 placeholder-gray-500 focus:ring-brand-blue focus:border-brand-blue border-gray-300 rounded-md" placeholder="Email" />
              </div>
              <div>
                <label htmlFor="message" className="sr-only">Message</label>
                <textarea id="message" name="message" rows={4} required className="block w-full shadow-sm py-3 px-4 placeholder-gray-500 focus:ring-brand-blue focus:border-brand-blue border border-gray-300 rounded-md" placeholder="Message"></textarea>
              </div>
              <div>
                <button type="submit" className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-brand-blue hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue">
                  Send Message
                </button>
              </div>
            </form>
        )}
      </div>
    </div>
  );
};

export default ContactPage;
