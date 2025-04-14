'use server';

import { auth, clerkClient } from "@clerk/nextjs/server";

export const completeOnboarding =  async (formData: FormData) => {
  const {userId} = await auth();
  if(!userId){
    return {message: 'No Logged In User'}
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const userType = formData.get('userType') as 'owner' | 'member' | null;
  const orgName = formData.get('orgName') as string | null;
  const orgSlug = formData.get('orgSlug') as string | null;
  const userEmail = user.emailAddresses;
  const name = user.fullName;

  try {
    //Create a user first with email and userId

  } catch (error) {
    
  }
  

  if(!userType){
      return{error: 'User type is required'}
  }
  
  
  try {
    const metadata: { onboardingComplete: boolean;}  = {
      onboardingComplete: true,
    }  

    if(userType === 'owner') {
      if(!orgName || !orgSlug) {
        return {error: 'Organization name and slug is required'}
      }
      
      //axios.post userId and orgName and orgSlug  to /create_organization because only owner will be making this request
    }

    if(userType === 'member'){
      //axios.post 
    }

    const updateUser = await client.users.updateUser(userId, {
      publicMetadata: metadata
    });

    return{message: updateUser.publicMetadata}

  } catch (error) {
    return { error: 'There was an error updating the user metadata.' }
  }
}
