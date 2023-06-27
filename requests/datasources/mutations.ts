import {
  CreatedResponse,
  DataSourceParams,
  DataSourceResponse,
  DataSourceTypes,
  SwaggerDataSourceParams,
} from "@/requests/datasources/types";
import { del, post } from "@/utils/api";

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
    `/projects/${projectId}/datasources/${type}` +
      ("swaggerUrl" in params ? `?swaggerUrl=${params.swaggerUrl}` : ""),
    params
  )) as DataSourceResponse | CreatedResponse;

  return response;
}

export const deleteDataSource = async (
  projectId: string,
  type: DataSourceTypes,
  id: string
) => {
  const response = (await del<any>(
    `/projects/${projectId}/datasources/${type}/${id}`
  )) as any;

  return response;
};
