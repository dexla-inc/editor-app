import { DataSourceAuthResponse, Endpoint } from "@/requests/datasources/types";
import Cookies from "js-cookie";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type AuthState = {
  accessToken?: string;
  expiresAt?: number;
};

type DataSourceState = {
  apiAuthConfig?: Omit<DataSourceAuthResponse, "type">;
  clearApiAuthConfig: () => void;
  setApiAuthConfig: (endpoints: Endpoint[]) => void;
  hasTokenExpired: () => boolean;
  refreshAccessToken: () => Promise<void>;
  setAuthTokens: (response: any) => void;
  clearAuthTokens: () => void;
  authState: AuthState;
  getAuthState: () => AuthState & { refreshToken?: string };
};

export const useDataSourceStore = create<DataSourceState>()(
  devtools(
    persist(
      (set, get) => ({
        apiAuthConfig: undefined,
        endpoints: undefined,
        authState: {},
        getAuthState: () => {
          const { accessToken, expiresAt } = get().authState;
          const refreshToken = Cookies.get("refreshToken");
          return { accessToken, expiresAt, refreshToken };
        },
        setAuthTokens: (response) => {
          const accessToken = response[response.accessTokenProperty];
          const refreshToken = response[response.refreshTokenProperty];
          const expirySeconds = response[response.expiryTokenProperty];
          const expiresAt = Date.now() + expirySeconds * 1000;

          Cookies.set("refreshToken", refreshToken, {
            expires: expirySeconds / 60 / 60 / 24,
          });

          set(
            { authState: { accessToken, expiresAt } },
            false,
            "datasource/setAuthTokens",
          );
        },
        hasTokenExpired: () => {
          const expiresAt = get().authState.expiresAt;
          if (expiresAt) {
            return Date.now() > expiresAt;
          }
          return true;
        },
        refreshAccessToken: async () => {
          const refreshToken = Cookies.get("refreshToken");

          if (!refreshToken || refreshToken === "undefined") {
            return;
          }

          const accessToken = get().authState.accessToken;
          const apiAuthConfig = get().apiAuthConfig;
          const hasTokenExpired = get().hasTokenExpired;
          const setAuthTokens = get().setAuthTokens;

          if (accessToken && !hasTokenExpired()) {
            return;
          }

          const url = apiAuthConfig?.refreshTokenUrl as string;

          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ refresh: refreshToken }),
          });

          const data = await response.json();
          setAuthTokens(data);
        },
        clearAuthTokens: () => {
          Cookies.remove("refreshToken");

          set({
            authState: {
              accessToken: undefined,
              expiresAt: undefined,
            },
          });
        },
        setApiAuthConfig: async (endpoints) => {
          const accessEndpoint = findEndpointByType(endpoints, "ACCESS");
          const refreshEndpoint = findEndpointByType(endpoints, "REFRESH");
          const userEndpoint = findEndpointByType(endpoints, "USER");

          const apiAuthConfig = {
            accessTokenUrl: accessEndpoint?.url as string,
            refreshTokenUrl: refreshEndpoint?.url as string,
            userEndpointUrl: userEndpoint?.url as string,
            accessTokenProperty: accessEndpoint?.authentication.tokenKey,
            refreshTokenProperty: refreshEndpoint?.authentication.tokenKey,
            expiryTokenProperty:
              accessEndpoint?.authentication.tokenSecondaryKey,
          };

          set({ apiAuthConfig });
        },
        clearApiAuthConfig: () => {
          set(
            { apiAuthConfig: undefined },
            false,
            "datasource/clearApiAuthConfig",
          );
        },
      }),
      {
        name: "datasource",
        partialize: (state: DataSourceState) => ({
          apiAuthConfig: state.apiAuthConfig,
          authState: {
            accessToken: state.authState.accessToken,
            expiresAt: state.authState.expiresAt,
          },
        }),
      },
    ),
    { name: "Data Source store" },
  ),
);

const findEndpointByType = (
  endpoints: Endpoint[],
  type: "ACCESS" | "REFRESH" | "USER",
) =>
  endpoints?.find((endpoint) => endpoint.authentication.endpointType === type);
