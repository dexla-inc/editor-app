import { DataSourceResponse } from "@/requests/datasources/types";
import { get } from "@/utils/api";
import { buildQueryString } from "@/utils/dashboardTypes";
import { evictCache } from "@/requests/cache/queries-noauth";

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

  const datasourceCacheTag = `/projects/${projectId}/datasources`;
  const endpointsCacheTag = `/projects/${projectId}/datasources/endpoints`;
  await evictCache(datasourceCacheTag);
  await evictCache(endpointsCacheTag);

  return response;
};
