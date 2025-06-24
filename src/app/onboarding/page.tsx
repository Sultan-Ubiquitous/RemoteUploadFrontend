'use client';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/api';
import { useRouter } from 'next/navigation';

const OnboardingForm = () => {
async function checkOnboarding(){
  const onBoardingStatus = await apiClient.get('onboarding/onboardingStatus');
  const isOnBoarded = onBoardingStatus.data.msg;
  if(isOnBoarded){
    router.push('/dashboard');   
    }
  }
  useEffect(()=>{
    checkOnboarding()
  }, []);  

  const router = useRouter();
  const [userType, setUserType] = useState<'editor' | 'youtuber' | null>(null);
  const [orgName, setOrgName] = useState('');
  const [orgSlug, setOrgSlug] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (userType === 'editor') {
        await apiClient.post('/onboarding/onboardEditor');
      } else if (userType === 'youtuber') {
        if (!orgName || !orgSlug) {
          throw new Error('Organization name and slug are required');
        }
        await apiClient.post('/onboarding/onboardOwner', {
          orgName,
          orgSlug,
        });
      }
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.response?.data?.message || error.message || 'An error occurred');
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setUserType(null);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome!</h1>
        <p className="text-gray-600 mb-8">Let's get you onboarded</p>

        {isLoading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto mb-4" />
            <p className="text-gray-600">Processing your request...</p>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            {userType === null ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Select your role</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Choose whether you're an editor or a youtuber
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    className="w-full px-6 py-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-70"
                    onClick={() => setUserType('editor')}
                  >
                    Editor
                  </button>
                  <button
                    type="button"
                    className="w-full px-6 py-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-70"
                    onClick={() => setUserType('youtuber')}
                  >
                    Youtuber
                  </button>
                </div>
              </div>
            ) : (
              <>
                {userType === 'youtuber' && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800">Organization details</h2>
                    <div>
                      <label htmlFor="orgName" className="block text-sm font-medium text-gray-700 mb-1">
                        Organization Name
                      </label>
                      <input
                        id="orgName"
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="orgSlug" className="block text-sm font-medium text-gray-700 mb-1">
                        Organization Slug
                      </label>
                      <input
                        id="orgSlug"
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        value={orgSlug}
                        onChange={(e) => setOrgSlug(e.target.value)}
                        required
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        This will be used in your organization's URL
                      </p>
                    </div>
                  </div>
                )}

                {error && <p className="text-sm text-red-500 mt-4">{error}</p>}

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-70"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-70"
                  >
                    Complete Onboarding
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default OnboardingForm;