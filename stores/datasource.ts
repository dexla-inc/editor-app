import {
  DataSourceAuthListResponse,
  DataSourceAuthResponse,
  Endpoint,
} from "@/requests/datasources/types";
import Cookies from "js-cookie";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type AuthState = {
  accessToken?: string;
  expiresAt?: number;
};

type DataSourceState = {
  apiAuthConfig?: DataSourceAuthListResponse;
  clearApiAuthConfig: () => void;
  setApiAuthConfig: (endpoints: Endpoint[]) => void;
  hasTokenExpired: () => boolean;
  refreshAccessToken: (dataSourceId: string) => Promise<void>;
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
        refreshAccessToken: async (dataSourceId: string) => {
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

          const url = apiAuthConfig?.authConfigurations[dataSourceId]
            .refreshTokenUrl as string;

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
        setApiAuthConfig: (endpoints) => {
          const authConfigurations: Record<string, DataSourceAuthResponse> =
            endpoints
              .filter(
                (f) =>
                  f.authentication.endpointType === "ACCESS" ||
                  f.authentication.endpointType === "REFRESH" ||
                  f.authentication.endpointType === "USER",
              )
              .reduce<Record<string, DataSourceAuthResponse>>(
                (acc, endpoint) => {
                  const {
                    dataSourceId,
                    authentication,
                    authenticationScheme,
                    url,
                  } = endpoint;

                  if (!acc[dataSourceId]) {
                    acc[dataSourceId] = {
                      type: authenticationScheme,
                      accessTokenUrl: undefined,
                      refreshTokenUrl: undefined,
                      userEndpointUrl: undefined,
                      accessTokenProperty: undefined,
                      refreshTokenProperty: undefined,
                      expiryTokenProperty: undefined,
                    };
                  }

                  switch (authentication.endpointType) {
                    case "ACCESS":
                      acc[dataSourceId].accessTokenUrl = url ?? undefined;
                      acc[dataSourceId].accessTokenProperty =
                        authentication.tokenKey;
                      acc[dataSourceId].expiryTokenProperty =
                        authentication.tokenSecondaryKey;
                      break;
                    case "REFRESH":
                      acc[dataSourceId].refreshTokenUrl = url ?? undefined;
                      acc[dataSourceId].refreshTokenProperty =
                        authentication.tokenKey;
                      break;
                    case "USER":
                      acc[dataSourceId].userEndpointUrl = url ?? undefined;
                      break;
                    default:
                      // Handle other types or ignore
                      break;
                  }

                  return acc;
                },
                {},
              );

          const apiAuthConfig: DataSourceAuthListResponse = {
            authConfigurations,
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
