import { DataSourceAuthResponse, Endpoint } from "@/requests/datasources/types";
import Cookies from "js-cookie";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type DataSourceState = {
  apiAuthConfig?: Omit<DataSourceAuthResponse, "type">;
  clearApiAuthConfig: () => void;
  setApiAuthConfig: (endpoints: Endpoint[]) => void;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  hasTokenExpired: () => boolean;
  refreshAccessToken: () => Promise<void>;
  setAuthTokens: (response: any) => void;
  clearAuthTokens: () => void;
};

export const useDataSourceStore = create<DataSourceState>()(
  devtools(
    persist(
      (set, get) => ({
        apiAuthConfig: undefined,
        endpoints: undefined,
        setAuthTokens: (response) => {
          const accessToken = response[response.accessTokenProperty];
          const refreshToken = response[response.refreshTokenProperty];
          const expirySeconds = response[response.expiryTokenProperty];
          const expiresAt = Date.now() + expirySeconds * 1000;

          Cookies.set("refreshToken", refreshToken, {
            expires: expirySeconds / 60 / 60 / 24,
          });

          set({ accessToken, expiresAt }, false, "datasource/setAuthTokens");
        },
        hasTokenExpired: () => {
          const expiresAt = get().expiresAt;
          if (expiresAt) {
            return Date.now() > expiresAt;
          }
          return true;
        },
        refreshAccessToken: async () => {
          const accessToken = get().accessToken;
          const refreshToken = Cookies.get("refreshToken");
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
            accessToken: undefined,
            refreshToken: undefined,
            expiresAt: undefined,
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
          accessToken: state.accessToken,
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
