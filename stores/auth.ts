import Cookies from "js-cookie";
import { create } from "zustand";

type AuthState = {
  refreshToken: string | null;
  expiresAt: number | null;
  apiConfig: {
    accessTokenUrl: string;
    refreshTokenUrl: string;
    userEndpointUrl: string;
    accessTokenProperty: string;
    refreshTokenProperty: string;
    expiryTokenProperty: string;
  };
  userObject: any;
  setAuthTokens: (response: any) => void;
  checkTokenExpiry: () => boolean;
  clearAuthTokens: () => void;
  refreshAccessToken: () => Promise<void>;
  setApiConfig: (
    accessTokenUrl: string,
    refreshTokenUrl: string,
    userEndpointUrl: string,
    accessTokenProperty: string,
    refreshTokenProperty: string,
    expiryTokenProperty: string
  ) => void;
  setUserObject: (userObject: any) => void;
  getAccessToken: () => string | null;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  refreshToken: null,
  expiresAt: null,
  userObject: null,
  apiConfig: {
    accessTokenUrl: "",
    refreshTokenUrl: "",
    userEndpointUrl: "",
    accessTokenProperty: "",
    refreshTokenProperty: "",
    expiryTokenProperty: "",
  },
  setAuthTokens: (response) => {
    const {
      accessTokenProperty,
      refreshTokenProperty,
      expiryTokenProperty,
      accessTokenUrl,
      refreshTokenUrl,
      userEndpointUrl,
    } = response;

    if (
      accessTokenProperty &&
      refreshTokenProperty &&
      expiryTokenProperty &&
      accessTokenUrl &&
      refreshTokenUrl &&
      userEndpointUrl
    ) {
      set({
        apiConfig: {
          accessTokenUrl,
          refreshTokenUrl,
          userEndpointUrl,
          accessTokenProperty,
          refreshTokenProperty,
          expiryTokenProperty,
        },
      });
    }

    const accessToken = response[accessTokenProperty];
    const refreshToken = response[refreshTokenProperty];
    const expirySeconds = response[expiryTokenProperty];
    console.log("accessToken", accessToken);
    console.log("refreshToken", refreshToken);

    const expiresAt = Date.now() + expirySeconds * 1000;
    Cookies.set("dexlaRefreshToken", refreshToken, {
      expires: 100, //expirySeconds / 60 / 60 / 24,
    }); // Convert seconds to days

    localStorage.setItem("dexlaToken", accessToken);

    set({
      refreshToken,
      expiresAt,
    });
  },
  clearAuthTokens: () => {
    Cookies.remove("dexlaRefreshToken");
    localStorage.removeItem("dexlaToken");
    set({ refreshToken: null, expiresAt: null });
  },
  checkTokenExpiry: () => {
    const expiresAt = get().expiresAt;
    if (!expiresAt) return true; // No token is considered as expired
    return Date.now() > expiresAt;
  },
  refreshAccessToken: async () => {
    const state = get();
    const accessToken = localStorage.getItem("dexlaToken");
    if (!accessToken || !state.checkTokenExpiry()) {
      return;
    }

    const response = await fetch(`${state.apiConfig.refreshTokenUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ refresh: state.refreshToken }),
    });

    const data = await response.json();
    state.setAuthTokens(data);
  },
  setApiConfig: (
    accessTokenUrl,
    refreshTokenUrl,
    userEndpointUrl,
    accessTokenProperty,
    refreshTokenProperty,
    expiryTokenProperty
  ) => {
    set({
      apiConfig: {
        accessTokenUrl,
        refreshTokenUrl,
        userEndpointUrl,
        accessTokenProperty,
        refreshTokenProperty,
        expiryTokenProperty,
      },
    });
  },
  setUserObject: (userObject) => {
    set({ userObject });
  },
  getAccessToken: () => {
    return localStorage.getItem("dexlaToken");
  },
}));
