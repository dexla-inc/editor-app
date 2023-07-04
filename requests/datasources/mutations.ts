import {
  DataSourceParams,
  DataSourceResponse,
  DataSourceTypes,
} from "@/requests/datasources/types";
import { PatchParams } from "@/requests/types";
import { del, patch, post, put } from "@/utils/api";

export async function createDataSource(
  projectId: string,
  type: DataSourceTypes,
  params: DataSourceParams
): Promise<DataSourceResponse> {
  const response = (await post<DataSourceResponse>(
    `/projects/${projectId}/datasources/${type}`,
    params
  )) as DataSourceResponse;

  return response;
}

export async function updateDataSource(
  projectId: string,
  id: string,
  reFetch: boolean,
  params: DataSourceParams
): Promise<DataSourceResponse> {
  console.log("refetch:" + reFetch);
  const response = (await put<DataSourceResponse>(
    `/projects/${projectId}/datasources/${id}?reFetch=${reFetch}`,
    params
  )) as DataSourceResponse;

  return response;
}

export async function patchDataSource(
  projectId: string,
  apiId: string,
  id: string,
  params: PatchParams[]
): Promise<DataSourceResponse> {
  const response = (await patch<DataSourceResponse>(
    `/projects/${projectId}/datasources/${apiId}/endpoints/${id}`,
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
