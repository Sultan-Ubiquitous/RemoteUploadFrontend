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
    const responseData = JSON.parse(response.config.data)
    console.log('User created: ', responseData.email);
    
  } catch (error) {
    console.error("Failed to make an user: ", error);
    return { error: 'Failed to create user account' };
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
      
      const response = await axios.post('http://localhost:8060/onboard/create_organization', {
        orgName: orgName,
        orgSlug: orgSlug,
        ownerId: userId,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
     });
      // console.log(responseData.ownerId);
      
      

      //axios.post userId and orgName and orgSlug  to /create_organization because only owner will be making this request
      console.log('Organization created hihi and onboarding complete', response.data);
      
      await client.users.updateUser(userId, {
        publicMetadata: {
          ...metadata,
          role: 'owner',
          organizationId: response.data
        }
      });

      return {
        success: 'Organization created successfully! Invite users to Organization from Invite page :)',
        organization: {
          name: orgName,
          slug: orgSlug,
          id: response.data
        }
      };
    }

    if(userType === 'member'){
      await client.users.updateUser(userId, {
        publicMetadata: {
          ...metadata,
          role: 'member',
        }
      });
      console.log('Member created hihi');
      return {
        success: 'Your account is created now please wait for your membership'
      }
    }

  } catch (error) {
    return { error: 'There was an error updating the user metadata.' }
  }
}
