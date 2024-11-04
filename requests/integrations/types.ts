export type IntegrationAuthUrlResponse = {
  url: string;
  authorisationType: AuthorisationTypes;
};

export type AuthorisationTypes = "NONE" | "OAUTH2" | "API_KEY";

export type IntegrationAuthenticationResponse = {
  id: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  expiresIn: number;
};
