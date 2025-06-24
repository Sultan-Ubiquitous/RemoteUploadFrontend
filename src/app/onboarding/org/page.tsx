'use client'
import apiClient from '@/lib/api';
import { useState } from 'react';

interface FormData {
  orgName: string;
  orgSlug: string;
}

export default function OnboardingForm() {
  const [formData, setFormData] = useState<FormData>({
    orgName: '',
    orgSlug: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.post('/onboarding/onboardOwner', formData);
      if (response.status === 200) {
        setSuccess(true);
      }
    } catch (err) {
      setError('Failed to submit form. Please try again.');
      console.error('Error submitting form:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-white">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Success!</h1>
          <p className="text-gray-600 mb-8">Your organization has been onboarded successfully.</p>
          <button
            onClick={() => setSuccess(false)}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-70"
          >
            Create Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Organization</h1>
        <p className="text-gray-600 mb-8">Enter your organization details to get started.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="orgName" className="block text-sm font-medium text-gray-700 mb-1">
                Organization Name
              </label>
              <input
                type="text"
                id="orgName"
                name="orgName"
                value={formData.orgName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Acme Inc."
              />
              <p className="text-sm text-gray-500 mt-1">This will be displayed to your users</p>
            </div>
            
            <div>
              <label htmlFor="orgSlug" className="block text-sm font-medium text-gray-700 mb-1">
                Organization Slug
              </label>
              <input
                type="text"
                id="orgSlug"
                name="orgSlug"
                value={formData.orgSlug}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="acme-inc"
              />
              <p className="text-sm text-gray-500 mt-1">Used in URLs and API calls</p>
            </div>
          </div>

          {error && <p className="text-sm text-red-500 mt-4">{error}</p>}

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-70"
              disabled={isLoading}
            >
              Back
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-70"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Create Organization'}
            </button>
          </div>
        </form>

        {isLoading && (
          <div className="mt-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600 text-center">Processing your request...</p>
          </div>
        )}
      </div>
    </div>
  );
}