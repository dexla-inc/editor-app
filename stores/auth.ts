import Cookies from "js-cookie";
import { create } from "zustand";

type AuthState = {
  accessToken: string | null;
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
};

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
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

    const state = get();

    // Then use the updated properties to extract the token values
    const accessToken = response[state.apiConfig.accessTokenProperty];
    const refreshToken = response[state.apiConfig.refreshTokenProperty];
    const expirySeconds = response[state.apiConfig.expiryTokenProperty];

    const expiresAt = Date.now() + expirySeconds * 1000;
    Cookies.set("dexlaRefreshToken", refreshToken, {
      expires: expirySeconds / 60 / 60 / 24,
    }); // Convert seconds to days

    set({
      accessToken,
      refreshToken,
      expiresAt,
    });
  },
  clearAuthTokens: () => {
    Cookies.remove("dexlaRefreshToken");
    set({ accessToken: null, refreshToken: null, expiresAt: null });
  },
  checkTokenExpiry: () => {
    const expiresAt = get().expiresAt;
    if (!expiresAt) return true; // No token is considered as expired
    return Date.now() > expiresAt;
  },
  refreshAccessToken: async () => {
    const state = get();

    if (!state.checkTokenExpiry()) {
      return;
    }

    const response = await fetch(`${state.apiConfig.refreshTokenUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.accessToken}`,
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
}));
