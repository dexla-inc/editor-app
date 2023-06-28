import {
  DataSourceResponse,
  DataSourcesListParams,
} from "@/requests/datasources/types";
import { PagedResponse } from "@/requests/types";
import { get } from "@/utils/api";

export const getDataSources = async (
  projectId: string,
  { type, search, offset, limit }: DataSourcesListParams
) => {
  let url = `/projects/${projectId}/datasources`;

  const params = new URLSearchParams();

  if (type) params.append("type", type);
  if (search) params.append("search", search);
  if (offset) params.append("offset", offset.toString());
  if (limit) params.append("limit", limit.toString());

  if (type || search || offset || limit) url += `?${params.toString()}`;

  const response = (await get<PagedResponse<DataSourceResponse>>(
    url,
    {}
  )) as PagedResponse<DataSourceResponse>;

  return response;
};

export const getDataSourceEndpoints = async (
  projectId: string,
  { type, search, offset, limit }: DataSourcesListParams
) => {
  let url = `/projects/${projectId}/datasources`;

  const params = new URLSearchParams();

  if (type) params.append("type", type);
  if (search) params.append("search", search);
  if (offset) params.append("offset", offset.toString());
  if (limit) params.append("limit", limit.toString());

  if (type || search || offset || limit) url += `?${params.toString()}`;

  const response = (await get<PagedResponse<DataSourceResponse>>(
    url,
    {}
  )) as PagedResponse<DataSourceResponse>;

  return response;
};
