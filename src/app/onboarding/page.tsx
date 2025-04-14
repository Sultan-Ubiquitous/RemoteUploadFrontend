'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { completeOnboarding } from './_actions'

type UserType = 'owner' | 'member' | null

const OnboardingForm = () => {
  const [userType, setUserType] = useState<UserType>(null)
  const [orgName, setOrgName] = useState<string>('')
  const [orgSlug, setOrgSlug] = useState<string>('')
  const [error, setError] = useState<string>('')
  const { user } = useUser()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!userType) {
      setError('Please select a user type')
      return
    }

    if (userType === 'owner' && (!orgName || !orgSlug)) {
      setError('Organization name and slug are required')
      return
    }

    try {
      const formData = new FormData()
      formData.append('userType', userType)
      if (userType === 'owner') {
        formData.append('orgName', orgName)
        formData.append('orgSlug', orgSlug)
      }

      const res = await completeOnboarding(formData)
      
      if (res?.error) {
        setError(res.error)
        return
      }

      // Reload the user's data from Clerk
      await user?.reload()
      router.push('/')
    } catch (err) {
      setError('An error occurred during onboarding')
      console.error(err)
    }
  }

  if (userType === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to Our Platform
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please tell us who you are
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setUserType('owner')}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Organization Owner
                </button>
                <button
                  onClick={() => setUserType('member')}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Organization Member
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (userType === 'member') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome, Team Member!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            You'll need an invitation from an organization owner to join their team.
          </p>
          <div className="mt-5 text-center">
            <button
              onClick={() => setUserType(null)}
              className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
            >
              Go back
            </button>
          </div>
          <div className="mt-8">
            <button
              onClick={handleSubmit}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Organization Information
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please provide your organization details
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="orgName" className="block text-sm font-medium text-gray-700">
                Organization Name
              </label>
              <div className="mt-1">
                <input
                  id="orgName"
                  name="orgName"
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="orgSlug" className="block text-sm font-medium text-gray-700">
                Organization URL
              </label>
              <div className="mt-1">
                <div className="flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                    yourdomain.com/
                  </span>
                  <input
                    id="orgSlug"
                    name="orgSlug"
                    type="text"
                    required
                    value={orgSlug}
                    onChange={(e) => setOrgSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="your-organization"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  This will be your organization's unique URL identifier
                </p>
              </div>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setUserType(null)}
                className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
              >
                Go back
              </button>
              <button
                type="submit"
                className="w-1/2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Organization
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default OnboardingForm