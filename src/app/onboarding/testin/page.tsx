'use client';
import apiClient from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type UserType = 'editor' | 'owner' | null;

async function completeOnBoarding(userType: UserType, channelData?: { channelName: string, orgSlug: string }) {
  try {
    const response = await apiClient.post('/completeOnboarding', {
      userType,
      ...(userType === 'owner' && channelData)
    });
    return response.data;
  } catch (error) {
    console.error('Error completing onboarding:', error);
    throw error;
  }
}

async function checkOnboardingStatus(apiClient: any) {
  const onBoardingStatus = await apiClient.get('/onboardingStatus');
  return onBoardingStatus.data.msg;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<UserType>(null);
  const [channelName, setChannelName] = useState('');
  const [orgSlug, setOrgSlug] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // const checkStatus = async () => {
    //   try {
    //     const isOnBoarded = await checkOnboardingStatus(apiClient);
    //     if (isOnBoarded) {
    //       router.push('/dashboard');
    //     }
    //   } catch (error) {
    //     console.error('Error checking onboarding status:', error);
    //   }
    // };
    // checkStatus();
  }, [router]);

  const handleUserTypeSelect = async (type: UserType) => {
    setUserType(type);
    if (type === 'editor') {
      setIsSubmitting(true);
      try {
        const result = await completeOnBoarding(type);
        if (result.success) {
          router.push('/editor-dashboard');
        } else {
          setMessage(result.message || 'Onboarding failed');
        }
      } catch (error) {
        setMessage('Error completing onboarding');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleOwnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await completeOnBoarding('owner', { channelName, orgSlug });
      if (result.success) {
        router.push('/dashboard');
      } else {
        setMessage(result.message || 'Onboarding failed');
      }
    } catch (error) {
      setMessage('Error completing onboarding');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (userType === null) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome</h1>
          <p className="text-gray-600 mb-8">Let's get you started</p>
          
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">What describes you best?</h2>
            <div className="space-y-4">
              <button
                onClick={() => handleUserTypeSelect('editor')}
                disabled={isSubmitting}
                className="w-full px-6 py-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-70"
              >
                <h3 className="font-medium text-gray-900">Editor/Member</h3>
                <p className="text-sm text-gray-500 mt-1">I want to contribute to existing channels</p>
              </button>
              <button
                onClick={() => handleUserTypeSelect('owner')}
                disabled={isSubmitting}
                className="w-full px-6 py-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-70"
              >
                <h3 className="font-medium text-gray-900">Owner</h3>
                <p className="text-sm text-gray-500 mt-1">I want to create and manage my own channel</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (userType === 'owner') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Channel Setup</h1>
          <p className="text-gray-600 mb-8">Please provide your channel details</p>
          
          <form onSubmit={handleOwnerSubmit} className="space-y-6">
            <div>
              <label htmlFor="channelName" className="block text-sm font-medium text-gray-700 mb-1">
                Channel Name
              </label>
              <input
                type="text"
                id="channelName"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label htmlFor="orgSlug" className="block text-sm font-medium text-gray-700 mb-1">
                Organization Slug
              </label>
              <input
                type="text"
                id="orgSlug"
                value={orgSlug}
                onChange={(e) => setOrgSlug(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
                disabled={isSubmitting}
              />
              <p className="mt-1 text-sm text-gray-500">This will be used in your URLs</p>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => setUserType(null)}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-70"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-70"
              >
                {isSubmitting ? 'Processing...' : 'Complete Setup'}
              </button>
            </div>
          </form>
          {message && <p className="mt-4 text-sm text-red-500">{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto mb-4"></div>
        <p className="text-gray-600">Completing your onboarding...</p>
        {message && <p className="mt-4 text-sm text-red-500">{message}</p>}
      </div>
    </div>
  );
}