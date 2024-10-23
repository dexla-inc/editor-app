import {
  DataSourceAuthListResponse,
  DataSourceResponse,
  DataSourcesListParams,
  Endpoint,
} from "@/requests/datasources/types";
import { buildQueryString } from "@/types/dashboardTypes";
import { get } from "@/utils/api";
import { PagingResponse } from "../types";

// Put this back when datasources are called from the deployment in live pages
export const getDataSources = async (
  projectId: string,
  { datasourceId, include, type, search, offset, limit }: DataSourcesListParams,
) => {
  let url = `/projects/${projectId}/datasources`;

  url += buildQueryString({
    datasourceId,
    include,
    type,
    search,
    offset,
    limit,
  });

  const response = (await get<PagingResponse<DataSourceResponse>>(
    url,
    {},
  )) as PagingResponse<DataSourceResponse>;

  return response;
};

// export const getDataSourceEndpoints = async (
//   projectId: string,
//   {
//     dataSourceId,
//     authOnly,
//     methodType,
//     search,
//     offset,
//     limit,
//   }: DataSourceEndpointsListParams = {},
// ) => {
//   let url = `/projects/${projectId}/datasources/endpoints`;

//   url += buildQueryString({
//     dataSourceId,
//     authOnly,
//     methodType,
//     search,
//     offset,
//     limit,
//   });

//   const response = (await get<PagingResponse<Endpoint>>(
//     url,
//     {},
//   )) as PagingResponse<Endpoint>;

//   return response;
// };

export const getDataSource = async (projectId: string, id: string) => {
  let url = `/projects/${projectId}/datasources/${id}`;

  const response = (await get<DataSourceResponse>(
    url,
    {},
  )) as DataSourceResponse;

  return response;
};

export const getDataSourceAuth = async (projectId: string) => {
  let url = `/projects/${projectId}/datasources/auth`;

  const response = (await get<DataSourceAuthListResponse>(
    url,
    {},
  )) as DataSourceAuthListResponse;

  return response;
};

export const getDataSourceEndpoint = async (
  projectId: string,
  id: string,
  cache: RequestCache,
) => {
  let url = `/projects/${projectId}/datasources/endpoints/${id}`;

  const response = (await get<Endpoint>(url, {}, cache)) as Endpoint;

  return response;
};

export const getSwagger = async (projectId: string, id: string) => {
  let url = `/projects/${projectId}/datasources/${id}/swagger`;

  const response = (await get<DataSourceResponse>(
    url,
    {},
  )) as DataSourceResponse;

  return response;
};
