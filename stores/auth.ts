import { cookies } from "next/headers";
import { create } from "zustand";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  apiUrls: {
    baseUrl: string;
    accessTokenUrl: string;
    refreshTokenUrl: string;
    userEndpointUrl: string;
  };
  tokenProperties: {
    accessTokenProp: string;
    refreshTokenProp: string;
    expirySecondsProp: string;
  };
  userObject: any;
  setAuthTokens: (response: any) => void;
  checkTokenExpiry: () => boolean;
  clearAuthTokens: () => void;
  refreshAccessToken: () => Promise<void>;
  setApiUrls: (
    baseUrl: string,
    accessTokenUrl: string,
    refreshTokenUrl: string,
    userEndpointUrl: string
  ) => void;
  setTokenProperties: (
    accessTokenProp: string,
    refreshTokenProp: string,
    expirySecondsProp: string
  ) => void;
  setUserObject: (userObject: any) => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
  userObject: null,
  apiUrls: {
    baseUrl: "",
    accessTokenUrl: "",
    refreshTokenUrl: "",
    userEndpointUrl: "",
  },
  tokenProperties: {
    accessTokenProp: "access_token",
    refreshTokenProp: "refresh_token",
    expirySecondsProp: "expiry_seconds",
  },
  setAuthTokens: (response) => {
    const { accessTokenProp, refreshTokenProp, expirySecondsProp } =
      get().tokenProperties;
    const accessToken = response[accessTokenProp];
    const refreshToken = response[refreshTokenProp];
    const expirySeconds = response[expirySecondsProp];
    const expiresAt = Date.now() + expirySeconds * 1000;
    const cookieStore = cookies();
    cookieStore.set("refreshToken", refreshToken, {
      expires: expirySeconds / 60 / 60 / 24,
    }); // Convert seconds to days
    set({ accessToken, refreshToken, expiresAt });
  },
  clearAuthTokens: () => {
    const cookieStore = cookies();
    cookieStore.set("refreshToken", "", { expires: new Date("2016-10-05") });
    set({ accessToken: null, refreshToken: null, expiresAt: null });
  },
  checkTokenExpiry: () => {
    const expiresAt = get().expiresAt;
    if (!expiresAt) return true; // No token is considered as expired
    return Date.now() > expiresAt;
  },
  refreshAccessToken: async () => {
    if (!get().checkTokenExpiry()) {
      return; // Token hasn't expired yet, no need to refresh
    }

    const response = await fetch(
      `${get().apiUrls.baseUrl}${get().apiUrls.refreshTokenUrl}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: get().refreshToken }),
      }
    );

    const data = await response.json();
    get().setAuthTokens(data);
  },
  setApiUrls: (baseUrl, accessTokenUrl, refreshTokenUrl, userEndpointUrl) => {
    set({
      apiUrls: {
        baseUrl,
        accessTokenUrl,
        refreshTokenUrl,
        userEndpointUrl,
      },
    });
  },
  setTokenProperties: (
    accessTokenProp,
    refreshTokenProp,
    expirySecondsProp
  ) => {
    set({
      tokenProperties: {
        accessTokenProp,
        refreshTokenProp,
        expirySecondsProp,
      },
    });
  },
  setUserObject: (userObject) => {
    set({ userObject });
  },
}));
