import {
  CreatedResponse,
  DataSourceParams,
  DataSourceResponse,
  DataSourceTypes,
  Endpoint,
  EndpointParams,
} from "@/requests/datasources/types";
import { PatchParams } from "@/requests/types";
import { del, patch, post, put } from "@/utils/api";

export async function createDataSource(
  projectId: string,
  type: DataSourceTypes,
  params: DataSourceParams,
): Promise<DataSourceResponse> {
  const response = (await post<DataSourceResponse>(
    `/projects/${projectId}/datasources/${type}`,
    params,
  )) as DataSourceResponse;

  return response;
}

export async function updateDataSource(
  projectId: string,
  id: string,
  reFetch: boolean,
  params: DataSourceParams,
): Promise<DataSourceResponse> {
  const response = (await put<DataSourceResponse>(
    `/projects/${projectId}/datasources/${id}?reFetch=${reFetch}`,
    params,
  )) as DataSourceResponse;

  return response;
}

export const deleteDataSource = async (projectId: string, id: string) => {
  const response = (await del<any>(
    `/projects/${projectId}/datasources/${id}`,
  )) as any;

  return response;
};

export const createDataSourceEndpoint = async (
  projectId: string,
  datasourceId: string,
  params: EndpointParams,
): Promise<CreatedResponse> => {
  const response = (await post<CreatedResponse>(
    `/projects/${projectId}/datasources/${datasourceId}/endpoints`,
    params,
  )) as CreatedResponse;

  return response;
};

export const updateDataSourceEndpoint = async (
  projectId: string,
  datasourceId: string,
  id: string,
  params: EndpointParams,
): Promise<Endpoint> => {
  const response = (await put<Endpoint>(
    `/projects/${projectId}/datasources/${datasourceId}/endpoints/${id}`,
    params,
  )) as Endpoint;

  return response;
};

export async function patchDataSourceEndpoint(
  projectId: string,
  apiId: string,
  id: string,
  params: PatchParams[],
): Promise<Endpoint> {
  const response = (await patch<Endpoint>(
    `/projects/${projectId}/datasources/${apiId}/endpoints/${id}`,
    params,
  )) as Endpoint;

  return response;
}

export const deleteDataSourceEndpoint = async (
  projectId: string,
  datasourceId: string,
  id: string,
): Promise<Endpoint> => {
  const response = (await del<Endpoint>(
    `/projects/${projectId}/datasources/${datasourceId}/endpoints/${id}`,
  )) as Endpoint;

  return response;
};
