import {
  PageListResponse,
  PageParams,
  PageResponse,
} from "@/requests/pages/types";
import { getAuthToken } from "@/utils/api";
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

export const getPageTemplate = async (projectId: string, pageId: string) => {
  const accessToken = await getAuthToken();
  const response = await fetch("/api/ai/page", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pageId,
      projectId,
      accessToken,
    }),
  });

  const json = await response.json();
  return json as any;
};

export const getPageBySlug = async (projectId: string, slug: string) => {
  const response = (await getWithoutAuth<PageResponse>(
    `/projects/${projectId}/pages/get?slug=${slug}`,
  )) as PageResponse;

  return response;
};
