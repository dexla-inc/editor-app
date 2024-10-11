import {
  DataSourceAuthResponse,
  DataSourceResponse,
} from "@/requests/datasources/types";
import { PagingResponse } from "@/requests/types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import Cookies from "js-cookie";

export type AuthState = {
  accessToken?: string;
  expiresAt?: number;
  additionalInfo?: Record<string, any>;
};

type DataSourceState = {
  apiAuthConfig?: Record<string, Omit<DataSourceAuthResponse, "type">>; // datasourceId -> authConfig
  clearApiAuthConfig: (projectId: string) => void;
  setApiAuthConfig: (data: DataSourceResponse[]) => void;
  hasTokenExpired: (projectId: string) => boolean;
  refreshAccessToken: (
    projectId: string,
    dataSourceId: string,
  ) => Promise<void>;
  setAuthTokens: (projectId: string, response: any) => void;
  clearAuthTokens: (projectId: string) => void;
  authState: Record<string, AuthState>; // projectId -> authState
  getAuthState: (
    projectId: string,
  ) => (AuthState & { refreshToken?: string }) | null;
};

export const useDataSourceStore = create<DataSourceState>()(
  devtools(
    persist(
      (set, get) => ({
        apiAuthConfig: undefined,
        authState: {},
        getAuthState: (projectId: string) => {
          const authInfo = get().authState[projectId];
          if (!authInfo) {
            // console.error(`No auth state found for projectId: ${projectId}`);
            return null; // Return null if no auth state is found
          }

          // Safely extract values, considering they might be undefined
          const { accessToken, expiresAt, additionalInfo } = authInfo;

          // Get the refresh token from cookies safely
          const refreshToken = Cookies.get(projectId);

          return {
            accessToken, // May be undefined, which is acceptable in this structured return
            expiresAt, // May be undefined
            refreshToken, // May be undefined, depending on the cookie presence
            additionalInfo, // May be undefined
          };
        },
        setAuthTokens: (projectId, response) => {
          const accessToken = response[response.accessTokenProperty];
          const refreshToken = response[response.refreshTokenProperty];
          const expirySeconds = response[response.expiryTokenProperty];
          const expiresAt = Date.now() + expirySeconds * 1000;

          const additionalInfo = Object.keys(response).reduce((acc, key) => {
            if (!keysToExcludeForMetadata.includes(key)) {
              // @ts-ignore
              acc[key] = response[key];
            }
            return acc;
          }, {});

          Cookies.set(projectId, refreshToken, {
            expires: 7,
          });

          set((state) => ({
            authState: {
              ...state.authState,
              [projectId]: {
                accessToken,
                refreshToken,
                expiresAt,
                additionalInfo,
              },
            },
          }));
        },
        hasTokenExpired: (projectId: string) => {
          const expiresAt = get().authState[projectId]?.expiresAt;

          if (expiresAt) {
            const now = Date.now();
            return now > expiresAt;
          }
          return true;
        },
        refreshAccessToken: async (projectId: string, dataSourceId: string) => {
          try {
            const authState = get().authState[projectId];
            const refreshToken = Cookies.get(projectId);

            if (!refreshToken || refreshToken === "undefined") {
              return;
            }

            const accessToken = authState?.accessToken;
            const state = get();
            const apiAuthConfig = state.apiAuthConfig?.[dataSourceId];
            const hasTokenExpired = state.hasTokenExpired;
            const setAuthTokens = state.setAuthTokens;

            if (accessToken && !hasTokenExpired(projectId)) {
              return;
            }

            if (!apiAuthConfig) {
              console.error(`No auth config found for projectId: ${projectId}`);
              return;
            }
            const url = apiAuthConfig.refreshTokenUrl as string;

            const refreshTokenProperty =
              apiAuthConfig.refreshTokenProperty as string;
            const headers: Record<string, string> = {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            };

            let finalUrl = url;

            if (apiAuthConfig.dataType === "SUPABASE") {
              headers["apiKey"] = apiAuthConfig.apiKey as string;
              finalUrl += "?grant_type=refresh_token";
            }

            const response = await fetch(finalUrl, {
              method: "POST",
              headers: headers,
              body: JSON.stringify({
                [refreshTokenProperty ?? "refresh"]: refreshToken,
              }),
            });

            if (!response.ok) return;

            const data = await response.json();
            const mergedAuthConfig = { ...data, ...apiAuthConfig };
            setAuthTokens(projectId, mergedAuthConfig);
            return data;
          } catch (error) {
            console.error("Failed to parse JSON:", error);
            return null;
          }
        },
        clearAuthTokens: (projectId: string) => {
          Cookies.remove(projectId);
          set({
            authState: {
              [projectId]: {
                accessToken: undefined,
                expiresAt: undefined,
                additionalInfo: undefined,
              },
            },
          });
        },
        setApiAuthConfig: (data: DataSourceResponse[]) => {
          const apiAuthConfig = data.reduce<
            Record<string, Omit<DataSourceAuthResponse, "type">>
          >((acc, dataSourceResponse) => {
            if (dataSourceResponse.auth) {
              const { type, ...authDetails } = dataSourceResponse.auth;
              acc[dataSourceResponse.id] = authDetails;
            }
            return acc;
          }, {});

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
          authState: state.authState,
          // authState: {
          //   accessToken: state.authState.accessToken,
          //   expiresAt: state.authState.expiresAt,
          //   additionalInfo: state.authState.additionalInfo,
          // },
        }),
      },
    ),
    { name: "Data Source store" },
  ),
);

const keysToExcludeForMetadata = [
  "accessTokenProperty",
  "refreshTokenProperty",
  "expiryTokenProperty",
  "accessTokenUrl",
  "refreshTokenUrl",
  "userEndpointUrl",
  "expiry_seconds",
  "access",
  "refresh",
  "access_token",
  "refresh_token",
  "apiKey",
  "dataType",
  "trackingId",
];
