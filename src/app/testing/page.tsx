'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';

export default function Home() {
  const [message, setMessage] = useState('');
  const {getToken} = useAuth();

  useEffect(() => {  
    const fetchData = async () => {
        try {
            const token = await getToken();
            const res = await fetch('http://localhost:8060/test', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            setMessage(data.message);
        } catch (error) {
            console.error('Failed to fetch:', error);
            setMessage('Sorry ninja, failed to fetch data');
        }
    }
        fetchData();
    }, [getToken]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl p-6 rounded-2xl text-center">
        <h1 className="text-2xl font-bold">Backend Message:</h1>
        <p className="text-lg text-gray-700 mt-2">{message}</p>
      </div>
    </main>
  );
}
 