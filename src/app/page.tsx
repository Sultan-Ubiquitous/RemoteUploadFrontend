'use client';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { useUser } from '@clerk/nextjs';

export default function Dashboard() {
  const router = useRouter();
  const {isLoaded, user } = useUser();
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Dashboard page" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-800">Welcome to Your Dashboard</h1>
              <p className="mt-2 text-gray-600">Choose an action below</p>
            </div>

            <div className="space-y-4">
              {user?.publicMetadata?.role === 'owner' && <button
                onClick={() => router.push('/upload')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
              >
                Upload Files
              </button>}

              <button
                onClick={() => router.push('/app-upload')}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
              >
                Upload to Application
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}