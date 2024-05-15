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
  apiAuthConfig?: Record<string, Omit<DataSourceAuthResponse, "type">>;
  clearApiAuthConfig: (projectId: string) => void;
  setApiAuthConfig: (
    projectId: string,
    data: PagingResponse<DataSourceResponse>,
  ) => void;
  hasTokenExpired: (projectId: string) => boolean;
  refreshAccessToken: (projectId: string) => Promise<void>;
  setAuthTokens: (projectId: string, response: any) => void;
  clearAuthTokens: (projectId: string) => void;
  authState: Record<string, AuthState>;
  getAuthState: (projectId: string) => AuthState & { refreshToken?: string };
};

export const useDataSourceStore = create<DataSourceState>()(
  devtools(
    persist(
      (set, get) => ({
        apiAuthConfig: undefined,
        authState: {},
        getAuthState: (projectId: string) => {
          const { accessToken, expiresAt, additionalInfo } =
            get().authState[projectId];
          const refreshToken = Cookies.get(projectId);
          return { accessToken, expiresAt, refreshToken, additionalInfo };
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

          Cookies.set(projectId, refreshToken);

          const currentAuthState = get().authState;
          const newAuthState = {
            ...currentAuthState,
            [projectId]: {
              accessToken,
              refreshToken,
              expiresAt,
              additionalInfo,
            },
          };

          set({ authState: newAuthState });
        },
        hasTokenExpired: (projectId: string) => {
          const expiresAt = get().authState[projectId]?.expiresAt;

          if (expiresAt) {
            const now = Date.now();
            return now > expiresAt;
          }
          return true;
        },
        refreshAccessToken: async (projectId: string) => {
          const authState = get().authState;
          const refreshToken = Cookies.get(projectId);

          if (!refreshToken || refreshToken === "undefined") {
            return;
          }

          const accessToken = authState?.accessToken;
          const apiAuthConfig = get().apiAuthConfig;
          const hasTokenExpired = get().hasTokenExpired;
          const setAuthTokens = get().setAuthTokens;

          if (accessToken && !hasTokenExpired(projectId)) {
            return;
          }

          const authConfig = apiAuthConfig?.[projectId];
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

          if (!response.ok) return;

          const mergedAuthConfig = { ...data, ...authConfig };
          setAuthTokens(projectId, mergedAuthConfig);
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
        setApiAuthConfig: (
          projectId: string,
          data: PagingResponse<DataSourceResponse>,
        ) => {
          const apiAuthConfig = data.results.reduce<
            Record<string, Omit<DataSourceAuthResponse, "type">>
          >((acc, dataSourceResponse) => {
            if (dataSourceResponse.auth) {
              const { type, ...authDetails } = dataSourceResponse.auth;
              acc[projectId] = authDetails;
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
