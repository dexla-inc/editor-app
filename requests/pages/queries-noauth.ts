import { Page, TemplateAiResponse } from "@/components/templates/dashboard";
import {
  PageListResponse,
  PageParams,
  PageResponse,
  PageStateHistoryResponse,
  PageStateResponse,
} from "@/requests/pages/types";
import { getWithoutAuth } from "@/utils/apiLive";
import { buildQueryString } from "@/types/dashboardTypes";
import { PagingResponse } from "@/requests/types";

export const getPageList = async (projectId: string, params?: PageParams) => {
  let url = `/projects/${projectId}/pages`;
  url += buildQueryString({ ...params });

  const response = (await getWithoutAuth<PageListResponse>(
    url,
  )) as PageListResponse;

  return response;
};

export const getPage = async (
  projectId: string,
  pageId: string,
  headers = {},
) => {
  const response = (await getWithoutAuth<PageResponse>(
    `/projects/${projectId}/pages/${pageId}`,
    headers,
  )) as PageResponse;

  return response;
};

export const getPageState = async (
  projectId: string,
  pageId: string,
  pageLoadTimestamp: number,
  history: number | null,
  init = {},
) => {
  const response = (await getWithoutAuth<PageStateResponse>(
    `/projects/${projectId}/pages/${pageId}/state?pageLoadTimestamp=${pageLoadTimestamp}&history=${history}`,
    init,
  )) as PageStateResponse;

  return response;
};

export const getPageStateHistory = async (
  projectId: string,
  pageId: string,
  timestamp: number,
) => {
  const response = (await getWithoutAuth<
    PagingResponse<PageStateHistoryResponse>
  >(
    `/projects/${projectId}/pages/${pageId}/state/history?timestamp=${timestamp}`,
  )) as PagingResponse<PageStateHistoryResponse>;

  return response;
};

export const analyseTemplateToUse = async (
  pageName: string,
  pageDescription: string,
  appDescription?: string,
  appIndustry?: string,
  init = {},
): Promise<TemplateAiResponse> => {
  const response = await fetch("/api/ai/template", {
    ...init,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pageName,
      pageDescription,
      appDescription,
      appIndustry,
    }),
  });

  const json = await response.json();
  return json as TemplateAiResponse;
};

export const getPageTemplate = async (
  projectId: string,
  pageId: string,
  init = {},
): Promise<Page> => {
  const response = await fetch("/api/ai/page", {
    ...init,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      projectId,
      pageId,
    }),
  });

  const json = await response.json();
  return json as Page;
};

export const getPageBySlug = async (projectId: string, slug: string) => {
  const response = (await getWithoutAuth<PageResponse>(
    `/projects/${projectId}/pages/get?slug=${slug}`,
  )) as PageResponse;

  return response;
};
