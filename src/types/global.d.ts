export {}

export type UserType = 'youtuber' | 'editor';
export type OrgName = string;

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean
    }
  }
}