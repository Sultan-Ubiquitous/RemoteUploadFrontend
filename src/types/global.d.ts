export {}

export type UserType = 'owner' | 'member';
export type OrgName = string;

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean
      role?: UserType
      organizationId?: OrgName
    }
  }
}