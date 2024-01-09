import {
  getDataSourceAuth,
  getDataSourceEndpoints,
} from "@/requests/datasources/queries-noauth";
import { DataSourceAuthResponse, Endpoint } from "@/requests/datasources/types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type DataSourceState = {
  apiAuthConfig?: DataSourceAuthResponse;
  setApiAuthConfig: (projectId: string, dataSourceId: string) => void;
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
        setApiAuthConfig: async (projectId, dataSourceId) => {
          const currentConfig = get().apiAuthConfig;
          if (currentConfig === undefined) {
            const apiAuthConfig = await getDataSourceAuth(
              projectId,
              dataSourceId,
            );
            set({ apiAuthConfig }, false, "datasource/setApiAuthConfig");
          }
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
          }
        },
        clearEndpoints: () => {
          set({ endpoints: undefined }, false, "datasource/clearEndpoints");
        },
      }),
      {
        name: "datasource",
        partialize: (state: DataSourceState) => ({
          apiAuthConfig: state.apiAuthConfig,
          endpoints: state.endpoints,
        }),
      },
    ),
    { name: "Data Souce store" },
  ),
);
