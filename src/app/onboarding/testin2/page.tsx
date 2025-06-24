'use client';
import apiClient from "@/lib/api";
import { useEffect, useState } from "react";


async function setRoleEditor(){
    try {
        const response = await apiClient.post('/onboarding/onBoardEditor');
        
        return response.data.data.name;

    } catch (error) {
        console.error("Error occurred assigning editor role", error);
        throw error;
    }
}

export default function page() {
  const [data, setData] = useState(' ');

  useEffect(()=>{
    setRoleEditor()
    .then(data=>{
        setData(data)
    });
  }, []);

    return (
      <div className="flex min-h-screen justify-center items-center">
      <p>{data} is now editor.</p>
      </div>
  )
}
