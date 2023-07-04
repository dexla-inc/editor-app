import {
  DataSourceEndpointsListParams,
  DataSourceResponse,
  DataSourcesListParams,
  Endpoint,
} from "@/requests/datasources/types";
import { PagingResponse } from "@/requests/types";
import { get } from "@/utils/api";
import { buildQueryString } from "@/utils/dashboardTypes";

export const getDataSources = async (
  projectId: string,
  { type, search, offset, limit }: DataSourcesListParams
) => {
  let url = `/projects/${projectId}/datasources`;

  url += buildQueryString({ type, search, offset, limit });

  const response = (await get<PagingResponse<DataSourceResponse>>(
    url,
    {}
  )) as PagingResponse<DataSourceResponse>;

  return response;
};

export const getDataSourceEndpoints = async (
  projectId: string,
  id: string,
  {
    authOnly,
    methodType,
    search,
    offset,
    limit,
  }: DataSourceEndpointsListParams = {}
) => {
  let url = `/projects/${projectId}/datasources/${id}/endpoints`;

  url += buildQueryString({ authOnly, methodType, search, offset, limit });

  const response = (await get<PagingResponse<Endpoint>>(
    url,
    {}
  )) as PagingResponse<Endpoint>;

  return response;
};

export const getDataSource = async (projectId: string, id: string) => {
  let url = `/projects/${projectId}/datasources/${id}`;

  const response = (await get<DataSourceResponse>(
    url,
    {}
  )) as DataSourceResponse;

  return response;
};

export const getSwagger = async (
  projectId: string,
  id: string,
  swaggerUrl: string
) => {
  let url = `/projects/${projectId}/datasources/${id}/swagger`;

  url += buildQueryString({ swaggerUrl });

  const response = (await get<DataSourceResponse>(
    url,
    {}
  )) as DataSourceResponse;

  return response;
};
