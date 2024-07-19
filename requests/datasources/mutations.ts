import {
  DataSourceParams,
  DataSourceResponse,
  DataSourceTypes,
  Endpoint,
  EndpointParams,
} from "@/requests/datasources/types";
import { CreatedResponse, PatchParams } from "@/requests/types";
import { del, patch, post, put } from "@/utils/api";
import { evictCache } from "@/requests/cache/queries-noauth";

export async function createDataSource(
  projectId: string,
  type: DataSourceTypes,
  params: DataSourceParams,
): Promise<DataSourceResponse> {
  const url = `/projects/${projectId}/datasources/${type}`;
  const response = (await post<DataSourceResponse>(
    url,
    params,
  )) as DataSourceResponse;

  const cacheTag = getDatasourcesCacheTag(projectId);
  await evictCache(cacheTag);

  return response;
}

export async function updateDataSource(
  projectId: string,
  id: string,
  reFetch: boolean,
  params: DataSourceParams,
): Promise<DataSourceResponse> {
  const url = `/projects/${projectId}/datasources/${id}?reFetch=${reFetch}`;
  const response = (await put<DataSourceResponse>(
    url,
    params,
  )) as DataSourceResponse;

  const cacheTag = getDatasourcesCacheTag(projectId);
  const dataSourceCacheTag = getDatasourceCacheTag(projectId, id);
  await evictCache(cacheTag);
  await evictCache(dataSourceCacheTag);

  return response;
}

export const deleteDataSource = async (projectId: string, id: string) => {
  const url = `/projects/${projectId}/datasources/${id}`;
  const response = (await del<any>(url)) as any;

  const cacheTag = getDatasourcesCacheTag(projectId);
  await evictCache(cacheTag);

  return response;
};

export const createDataSourceEndpoint = async (
  projectId: string,
  datasourceId: string,
  params: EndpointParams,
): Promise<CreatedResponse> => {
  const url = `/projects/${projectId}/datasources/${datasourceId}/endpoints`;
  const response = (await post<CreatedResponse>(
    url,
    params,
  )) as CreatedResponse;

  const cacheTag = getDatasourcesCacheTag(projectId);
  await evictCache(cacheTag);

  return response;
};

export const updateDataSourceEndpoint = async (
  projectId: string,
  datasourceId: string,
  id: string,
  params: EndpointParams,
): Promise<Endpoint> => {
  const url = `/projects/${projectId}/datasources/${datasourceId}/endpoints/${id}`;
  const response = (await put<Endpoint>(url, params)) as Endpoint;

  const cacheTag = getDatasourcesCacheTag(projectId);
  await evictCache(cacheTag);

  return response;
};

export async function patchDataSourceEndpoint(
  projectId: string,
  apiId: string,
  id: string,
  params: PatchParams[],
): Promise<Endpoint> {
  const url = `/projects/${projectId}/datasources/${apiId}/endpoints/${id}`;
  const response = (await patch<Endpoint>(url, params)) as Endpoint;

  const cacheTag = getDatasourcesCacheTag(projectId);
  await evictCache(cacheTag);

  return response;
}

export const deleteDataSourceEndpoint = async (
  projectId: string,
  datasourceId: string,
  id: string,
): Promise<Endpoint> => {
  const url = `/projects/${projectId}/datasources/${datasourceId}/endpoints/${id}`;
  const response = (await del<Endpoint>(url)) as Endpoint;

  const cacheTag = getDatasourcesCacheTag(projectId);
  await evictCache(cacheTag);

  return response;
};

const getDatasourcesCacheTag = (projectId: string) =>
  `/projects/${projectId}/datasources`;

const getDatasourceCacheTag = (projectId: string, id: string) =>
  `/projects/${projectId}/datasources/${id}`;
