import {
  DataSourceAuthListResponse,
  DataSourceAuthResponse,
  DataSourceResponse,
} from "@/requests/datasources/types";
import { PagingResponse } from "@/requests/types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type AuthState = {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  additionalInfo?: Record<string, any>;
};

type DataSourceState = {
  apiAuthConfig?: Record<string, Omit<DataSourceAuthResponse, "type">>;
  clearApiAuthConfig: (dataSourceId: string) => void;
  setApiAuthConfig: (data: PagingResponse<DataSourceResponse>) => void;
  hasTokenExpired: (dataSourceId: string) => boolean;
  refreshAccessToken: (dataSourceId: string) => Promise<void>;
  setAuthTokens: (dataSourceId: string, response: any) => void;
  clearAuthTokens: (dataSourceId: string) => void;
  authState: Record<string, AuthState>;
};

export const useDataSourceStore = create<DataSourceState>()(
  devtools(
    persist(
      (set, get) => ({
        apiAuthConfig: undefined,
        authState: {},
        setAuthTokens: (dataSourceId, response) => {
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

          const currentAuthState = get().authState;
          const newAuthState = {
            ...currentAuthState,
            [dataSourceId]: {
              accessToken,
              refreshToken,
              expiresAt,
              additionalInfo,
            },
          };

          set({ authState: newAuthState });
        },
        hasTokenExpired: (dataSourceId: string) => {
          const expiresAt = get().authState[dataSourceId]?.expiresAt;

          if (expiresAt) {
            const now = Date.now();
            return now > expiresAt;
          }
          return true;
        },
        refreshAccessToken: async (dataSourceId: string) => {
          const authState = get().authState[dataSourceId];
          const refreshToken = authState?.refreshToken;

          if (!refreshToken || refreshToken === "undefined") {
            return;
          }

          const accessToken = authState?.accessToken;
          const apiAuthConfig = get().apiAuthConfig;
          const hasTokenExpired = get().hasTokenExpired;
          const setAuthTokens = get().setAuthTokens;

          if (accessToken && !hasTokenExpired(dataSourceId)) {
            return;
          }
          const authConfig = apiAuthConfig?.[dataSourceId];
          const url = authConfig?.refreshTokenUrl as string;

          const refreshTokenProperty =
            authConfig?.refreshTokenProperty as string;
          const headers: Record<string, string> = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          };

          let finalUrl = url;

          if (authConfig?.dataType === "SUPABASE") {
            headers["apiKey"] = authConfig?.apiKey as string;
            finalUrl += "?grant_type=refresh_token";
          }

          const response = await fetch(finalUrl, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
              [refreshTokenProperty ?? "refresh"]: refreshToken,
            }),
          });

          const data = await response.json();

          const mergedAuthConfig = { ...data, ...authConfig };
          setAuthTokens(dataSourceId, mergedAuthConfig);
        },
        clearAuthTokens: (dataSourceId: string) => {
          set({
            authState: {
              [dataSourceId]: {
                accessToken: undefined,
                refreshToken: undefined,
                expiresAt: undefined,
                additionalInfo: undefined,
              },
            },
          });
        },
        setApiAuthConfig: (data: PagingResponse<DataSourceResponse>) => {
          const apiAuthConfig = data.results.reduce<DataSourceAuthListResponse>(
            (acc, dataSourceResponse) => {
              if (dataSourceResponse.auth) {
                const { type, ...authDetails } = dataSourceResponse.auth;
                // @ts-ignore
                acc[dataSourceResponse.id] = authDetails;
              }
              return acc;
            },
            { authConfigurations: {} },
          );

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
