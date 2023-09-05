import Cookies from "js-cookie";
import { create } from "zustand";

type ApiConfig = {
  accessTokenUrl: string;
  refreshTokenUrl: string;
  userEndpointUrl: string;
  accessTokenProperty: string;
  refreshTokenProperty: string;
  expiryTokenProperty: string;
};

type AuthState = {
  refreshToken: string | null;
  expiresAt: number | null;
  apiConfig: ApiConfig;
  userObject: any;
  setAuthTokens: (response: any) => void;
  hasTokenExpired: () => boolean;
  clearAuthTokens: () => void;
  refreshAccessToken: () => Promise<void>;
  setApiConfig: (apiConfig: ApiConfig) => void;
  setUserObject: (userObject: any) => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  getApiConfig: () => ApiConfig | null;
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
    const storedConfig = get().getApiConfig();

    const {
      accessTokenProperty = storedConfig?.accessTokenProperty,
      refreshTokenProperty = storedConfig?.refreshTokenProperty,
      expiryTokenProperty = storedConfig?.expiryTokenProperty,
      accessTokenUrl = storedConfig?.accessTokenUrl,
      refreshTokenUrl = storedConfig?.refreshTokenUrl,
      userEndpointUrl = storedConfig?.userEndpointUrl,
    } = response;

    const apiConfig = {
      accessTokenUrl,
      refreshTokenUrl,
      userEndpointUrl,
      accessTokenProperty,
      refreshTokenProperty,
      expiryTokenProperty,
    };

    set({
      apiConfig: apiConfig,
    });

    const accessToken = response[accessTokenProperty];
    const refreshToken = response[refreshTokenProperty];
    const expirySeconds = response[expiryTokenProperty];

    // Only update if these values are valid
    if (accessToken && typeof accessToken === "string") {
      localStorage.setItem("dexlaToken", accessToken);
    }

    if (refreshToken && typeof refreshToken === "string") {
      Cookies.set("dexlaRefreshToken", refreshToken, {
        expires: expirySeconds / 60 / 60 / 24,
      });
      set({ refreshToken });
    }

    if (expirySeconds && typeof expirySeconds === "number") {
      const expiresAt = Date.now() + expirySeconds * 1000;
      set({ expiresAt });
    }

    if (apiConfig && apiConfig.refreshTokenUrl) {
      localStorage.setItem("apiConfig", JSON.stringify(apiConfig));
    }
  },
  clearAuthTokens: () => {
    Cookies.remove("dexlaRefreshToken");
    localStorage.removeItem("dexlaToken");
    set({ refreshToken: null, expiresAt: null });
  },
  hasTokenExpired: () => {
    const expiresAt = get().expiresAt;
    if (expiresAt) {
      return Date.now() > expiresAt;
    }
    return true;
  },
  refreshAccessToken: async () => {
    const state = get();
    const accessToken = state.getAccessToken();
    const refreshToken = state.getRefreshToken();

    if (accessToken && !state.hasTokenExpired()) {
      return;
    }

    const response = await fetch(`${state.getApiConfig()?.refreshTokenUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    const data = await response.json();
    state.setAuthTokens(data);
  },
  setApiConfig: (config: ApiConfig) => {
    set({ apiConfig: config });
  },
  setUserObject: (userObject) => {
    set({ userObject });
  },
  getAccessToken: () => {
    return localStorage.getItem("dexlaToken");
  },
  getRefreshToken: () => {
    return Cookies.get("dexlaRefreshToken") || null;
  },
  getApiConfig: () => {
    return JSON.parse(localStorage.getItem("apiConfig") || "{}");
  },
}));
