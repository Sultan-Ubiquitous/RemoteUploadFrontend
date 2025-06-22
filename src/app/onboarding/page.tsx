'use client';
import apiClient from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

async function completeOnBoarding(){
  try {
    
    const response = await apiClient.get('/onboardingComplete');
    return response.data.msg;
  } catch (error) {
    
    console.error('Error completing onboarding:', error);
    throw error;

  }
}



export default function page() {
  const router = useRouter();
  const [data, setData] = useState('');

  async function checkOnboarding(){
  const onBoardingStatus = await apiClient.get('/onboardingStatus');
  const isOnBoarded = onBoardingStatus.data.msg;
  if(isOnBoarded){
    router.push('/dashboard');   
  }
}

  useEffect(()=>{
    // checkOnboarding()
    // completeOnBoarding()
    // .then(data=>{
    //   if(data){
    //     router.push('/dashboard')
    //   }
    //   setData(data.toString())}
    // )
    // .catch(err => {
    //   console.log('Some error occured', err);
    //   setData('Some error occured')
    // })
    
  }, []);

  return (
    <div className='flex justify-center items-center min-h-screen flex-col gap-5'>
      <p>If you are visiting this page, your onboarding is now complete :D</p>
      <p>Response: {data}</p>
    </div>
  )
}
