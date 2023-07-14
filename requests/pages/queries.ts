import {
  PageListResponse,
  PageParams,
  PageResponse,
} from "@/requests/pages/types";
import { get } from "@/utils/api";
import { buildQueryString } from "@/utils/dashboardTypes";

export const getPageList = async (projectId: string, params?: PageParams) => {
  let url = `/projects/${projectId}/pages`;
  url += buildQueryString({ ...params });

  const response = (await get<PageListResponse>(url, {})) as PageListResponse;

  return response;
};

export const getPage = async (projectId: string, pageId: string) => {
  const response = (await get<PageResponse>(
    `/projects/${projectId}/pages/${pageId}`,
    {}
  )) as PageResponse;

  return response;
};
