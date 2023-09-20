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

  const response = (await get<PageListResponse>(
    url,
    {},
    false,
    true,
  )) as PageListResponse;

  return response;
};

export const getPage = async (projectId: string, pageId: string) => {
  const response = (await get<PageResponse>(
    `/projects/${projectId}/pages/${pageId}`,
    {},
    false,
    true,
  )) as PageResponse;

  return response;
};

export const getPageBySlug = async (projectId: string, slug: string) => {
  const response = (await get<PageResponse>(
    `/projects/${projectId}/pages/${slug}/slug`,
  )) as PageResponse;

  return response;
};
