import { getDataSourceEndpoints } from "@/requests/datasources/queries-noauth";
import { DataSourceAuthResponse, Endpoint } from "@/requests/datasources/types";
import Cookies from "js-cookie";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type DataSourceState = {
  apiAuthConfig?: Omit<DataSourceAuthResponse, "type">;
  clearApiAuthConfig: () => void;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  hasTokenExpired: () => boolean;
  refreshAccessToken: () => Promise<void>;
  setAuthTokens: (response: any) => void;
  clearAuthTokens: () => void;
  endpoints?: Endpoint[];
  fetchEndpoints: (projectId: string) => void;
  clearEndpoints: () => void;
};

export const useDataSourceStore = create<DataSourceState>()(
  devtools(
    persist(
      (set, get) => ({
        apiAuthConfig: undefined,
        endpoints: undefined,
        setAuthTokens: (response) => {
          const apiAuthConfig = get().apiAuthConfig as DataSourceAuthResponse;

          if (
            apiAuthConfig.accessTokenProperty === undefined ||
            apiAuthConfig.refreshTokenProperty === undefined ||
            apiAuthConfig.expiryTokenProperty === undefined
          ) {
            console.error("Missing auth config");
            return;
          }
          const accessToken = response[apiAuthConfig.accessTokenProperty];
          const refreshToken = response[apiAuthConfig.refreshTokenProperty];
          const expirySeconds = response[apiAuthConfig.expiryTokenProperty];
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
        fetchEndpoints: async (projectId) => {
          const currentEndpoints = get().endpoints;
          if (currentEndpoints === undefined) {
            const endpoints = await getDataSourceEndpoints(projectId);

            set(
              { endpoints: endpoints.results },
              false,
              "datasource/setEndpoints",
            );

            const accessEndpoint = findEndpointByType(
              endpoints.results,
              "ACCESS",
            );
            const refreshEndpoint = findEndpointByType(
              endpoints.results,
              "REFRESH",
            );
            const userEndpoint = findEndpointByType(endpoints.results, "USER");

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
          }
        },
        clearEndpoints: () => {
          set({ endpoints: undefined }, false, "datasource/clearEndpoints");
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
          endpoints: state.endpoints,
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
