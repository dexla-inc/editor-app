import {
  CreatedResponse,
  DataSourceParams,
  DataSourceResponse,
  DataSourceTypes,
  SwaggerDataSourceParams,
} from "@/requests/datasources/types";
import { del, patch, post, put } from "@/utils/api";
import { PatchParams } from "../types";

export async function createDataSource(
  projectId: string,
  type: DataSourceTypes,
  params: SwaggerDataSourceParams
): Promise<DataSourceResponse>;

export async function createDataSource(
  projectId: string,
  type: DataSourceTypes,
  params: DataSourceParams
): Promise<CreatedResponse>;

export async function createDataSource(
  projectId: string,
  type: DataSourceTypes,
  params: DataSourceParams | SwaggerDataSourceParams
): Promise<DataSourceResponse | CreatedResponse> {
  const response = (await post<DataSourceResponse | CreatedResponse>(
    `/projects/${projectId}/datasources/${type}`,
    params
  )) as DataSourceResponse | CreatedResponse;

  return response;
}

export async function updateDataSource(
  projectId: string,
  id: string,
  reFetch: boolean,
  params: DataSourceParams | SwaggerDataSourceParams
): Promise<DataSourceResponse> {
  const response = (await put<DataSourceResponse>(
    `/projects/${projectId}/datasources/${id}` +
      ("refetch" in params ? `?refetch=${reFetch}` : ""),
    params
  )) as DataSourceResponse;

  return response;
}

export async function patchDataSource(
  projectId: string,
  type: string,
  apiId: string,
  id: string,
  params: PatchParams[]
): Promise<DataSourceResponse> {
  const response = (await patch<DataSourceResponse>(
    `/projects/${projectId}/datasources/${type}/${apiId}/endpoints/${id}`,
    params
  )) as DataSourceResponse;

  return response;
}

export const deleteDataSource = async (projectId: string, id: string) => {
  const response = (await del<any>(
    `/projects/${projectId}/datasources/${id}`
  )) as any;

  return response;
};
