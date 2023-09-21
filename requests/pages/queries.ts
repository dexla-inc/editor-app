import {
  PageListResponse,
  PageParams,
  PageResponse,
} from "@/requests/pages/types";
import { getWithoutAuth } from "@/utils/apiNoAuth";
import { buildQueryString } from "@/utils/dashboardTypes";

export const getPageList = async (projectId: string, params?: PageParams) => {
  let url = `/projects/${projectId}/pages`;
  url += buildQueryString({ ...params });

  const response = (await getWithoutAuth<PageListResponse>(
    url,
  )) as PageListResponse;

  return response;
};

export const getPage = async (projectId: string, pageId: string) => {
  const response = (await getWithoutAuth<PageResponse>(
    `/projects/${projectId}/pages/${pageId}`,
  )) as PageResponse;

  return response;
};

export const getPageBySlug = async (projectId: string, slug: string) => {
  const response = (await getWithoutAuth<PageResponse>(
    `/projects/${projectId}/pages/get?slug=${slug}`,
  )) as PageResponse;

  return response;
};
