import {
  DataSourceAuthResponse,
  DataSourceEndpointsListParams,
  DataSourceResponse,
  DataSourcesListParams,
  Endpoint,
} from "@/requests/datasources/types";
import { PagingResponse } from "@/requests/types";
import { getWithoutAuth } from "@/utils/apiNoAuth";
import { buildQueryString } from "@/utils/dashboardTypes";

export const getDataSources = async (
  projectId: string,
  { type, search, offset, limit }: DataSourcesListParams,
) => {
  let url = `/projects/${projectId}/datasources`;

  url += buildQueryString({ type, search, offset, limit });

  const response = (await getWithoutAuth<PagingResponse<DataSourceResponse>>(
    url,
    {},
  )) as PagingResponse<DataSourceResponse>;

  return response;
};

export const getDataSourceEndpoints = async (
  projectId: string,
  {
    dataSourceId,
    authOnly,
    methodType,
    search,
    offset,
    limit,
  }: DataSourceEndpointsListParams = {},
) => {
  let url = `/projects/${projectId}/datasources/endpoints`;

  url += buildQueryString({
    dataSourceId,
    authOnly,
    methodType,
    search,
    offset,
    limit,
  });

  const response = (await getWithoutAuth<PagingResponse<Endpoint>>(
    url,
    {},
  )) as PagingResponse<Endpoint>;

  return response;
};

export const getDataSource = async (projectId: string, id: string) => {
  let url = `/projects/${projectId}/datasources/${id}`;

  const response = (await getWithoutAuth<DataSourceResponse>(
    url,
    {},
  )) as DataSourceResponse;

  return response;
};

export const getDataSourceAuth = async (projectId: string, id: string) => {
  let url = `/projects/${projectId}/datasources/${id}/auth`;

  const response = (await getWithoutAuth<DataSourceAuthResponse>(
    url,
    {},
  )) as DataSourceAuthResponse;

  return response;
};
