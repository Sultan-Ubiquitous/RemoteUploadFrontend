'use server';

import { auth, clerkClient } from "@clerk/nextjs/server";
import axios from "axios";

export const completeOnboarding =  async (formData: FormData) => {
  const {userId} = await auth();
  const {getToken} = await auth();
  const token = await getToken();
  
  if(!userId){
    return {message: 'No Logged In User'}
  }

  const client = await clerkClient();
  const onlyId = userId.slice(5);
  const user = await client.users.getUser(userId);
  const userType = formData.get('userType') as 'owner' | 'member' | null;
  const orgName = formData.get('orgName') as string | null;
  const orgSlug = formData.get('orgSlug') as string | null;
  
  //create first user
  try {
    const response = await axios.post('http://localhost:8060/onboard/create_user', {
      email: user.emailAddresses[0].emailAddress,
      userId: userId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('User created: ', response.data);
    return response.data;

  } catch (error) {
    console.error("Failed to make an user: ", error);
  }

  

  if(!userType){
      return{error: 'User type is required'}
  }
  
  
  try {
    // const metadata: { onboardingComplete: boolean;}  = {
    //   onboardingComplete: true,
    // }  

    if(userType === 'owner') {
      if(!orgName || !orgSlug) {
        return {error: 'Organization name and slug is required'}
      }
      
      //axios.post userId and orgName and orgSlug  to /create_organization because only owner will be making this request
      console.log('Owner created hihi');
      
      return;
    }

    if(userType === 'member'){
      //axios.post 
      console.log('Member created hihi');
      return;
    }

    // const updateUser = await client.users.updateUser(userId, {
    //   publicMetadata: metadata
    // });

    return{message: "Did some shit"}

  } catch (error) {
    return { error: 'There was an error updating the user metadata.' }
  }
}
