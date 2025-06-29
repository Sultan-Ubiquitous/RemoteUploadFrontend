'use client';

import apiClient from '@/lib/api';
import axios from 'axios';
import { useEffect, useState } from 'react';

type UserRole = 'owner' | 'editor' | 'viewer' | null;

export default function AccessControlPage() {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await apiClient.get('/info/userRole');
        setUserRole(response.data.data.role);
        console.log(response.data.data.role);
        
      } catch (err) {
        setError('Failed to fetch user role');
        
        console.error('Error fetching user role:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-white">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your access information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-white">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-8">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome</h1>
        
        {userRole === 'owner' && (
          <>
            <p className="text-gray-600 mb-4">You have owner privileges</p>
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Owner Actions</h2>
              <button className="w-full px-6 py-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 mb-2">
                Manage Organization Settings
              </button>
              <button className="w-full px-6 py-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
                Invite New Members
              </button>
            </div>
          </>
        )}

        {userRole === 'editor' && (
          <>
            <p className="text-gray-600 mb-4">You have editor privileges</p>
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Editor Actions</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Choose Organization</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black">
                    <option>Organization 1</option>
                    <option>Organization 2</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">Select an organization to work with</p>
                </div>
                <button className="w-full px-6 py-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
                  Edit Content
                </button>
              </div>
            </div>
          </>
        )}

        {userRole === 'viewer' && (
          <>
            <p className="text-gray-600 mb-4">You have viewer privileges</p>
            <div className="mt-6">
              <p className="text-gray-800">Please wait for someone to invite you to an organization.</p>
              <p className="text-sm text-gray-500 mt-4">Only you can see this message.</p>
            </div>
          </>
        )}

        {!userRole && (
          <div className="mt-6">
            <p className="text-red-500">No access role assigned. Please contact your administrator.</p>
          </div>
        )}
      </div>
    </div>
  );
}