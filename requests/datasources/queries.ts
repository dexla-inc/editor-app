import { DataSourceResponse } from "@/requests/datasources/types";
import { get } from "@/utils/api";
import { buildQueryString } from "@/utils/dashboardTypes";

export const getSwagger = async (
  projectId: string,
  id: string,
  swaggerUrl: string,
) => {
  let url = `/projects/${projectId}/datasources/${id}/swagger`;

  url += buildQueryString({ swaggerUrl });

  const response = (await get<DataSourceResponse>(
    url,
    {},
  )) as DataSourceResponse;

  return response;
};
