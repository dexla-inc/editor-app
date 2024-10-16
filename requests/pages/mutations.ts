import {
  PageAIResponse,
  PageBody,
  PageConfigProps,
  PageListResponse,
  PageParams,
  PageResponse,
  PageStateHistoryResponse,
  PageStateParams,
  PageStateResponse,
  PagesResponse,
} from "@/requests/pages/types";
import { del, patch, post, put, get } from "@/utils/api";
import { evictCache } from "../cache/queries-noauth";
import { PagingResponse, PatchParams } from "@/requests/types";
import { buildQueryString } from "@/types/dashboardTypes";

export const createPage = async (
  params: PageConfigProps,
  projectId: string,
) => {
  const response = (await post<PageResponse>(
    `/projects/${projectId}/pages`,
    params,
  )) as PageResponse;

  const cacheTag = getCacheTag(projectId);
  await evictCache(cacheTag);

  return response;
};

export const updatePage = async (
  params: PageBody,
  projectId: string,
  pageId: string,
) => {
  const response = (await put<PageResponse>(
    `/projects/${projectId}/pages/${pageId}`,
    params,
  )) as PageResponse;

  const cacheTag = getCacheTag(projectId);
  const pageCacheTag = getPageCacheTag(projectId, pageId);
  await evictCache(cacheTag);
  await evictCache(pageCacheTag);

  return response;
};

export const patchPage = async (
  projectId: string,
  pageId: string,
  params: PatchParams[],
) => {
  let url = `/projects/${projectId}/pages/${pageId}`;

  const response = (await patch<PageResponse>(url, params)) as PageResponse;

  const cacheTag = getCacheTag(projectId);
  const pageCacheTag = getPageCacheTag(projectId, pageId);
  await evictCache(cacheTag);
  await evictCache(pageCacheTag);

  return response;
};

export const createPages = async (params: PageBody[], projectId: string) => {
  const response = (await post<PagesResponse>(
    `/projects/${projectId}/pages/many`,
    params,
  )) as PagesResponse;

  const cacheTag = getCacheTag(projectId);
  await evictCache(cacheTag);

  return response;
};

export const createPageList = async (
  projectId: string,
  description: string,
  industry: string,
  pageCount?: string,
  excludedPages?: string,
  init = {},
): Promise<PageAIResponse[]> => {
  const response = await fetch("/api/ai/page-list", {
    ...init,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      projectId,
      description,
      industry,
      pageCount,
      excludedPages,
    }),
  });

  const json = await response.json();

  return Array.isArray(json) ? json : [json];
};

// Page is empty in dev
export const updatePageState = async (
  state: PageStateParams["state"],
  description: PageStateParams["description"],
  projectId: string,
  pageId: string,
  pageLoadTimestamp: number | undefined,
  history: number | null,
) => {
  const url = `/projects/${projectId}/pages/${pageId}/state?pageLoadTimestamp=${pageLoadTimestamp}&history=${history}`;
  const response = (await put<any>(url, {
    state,
    description,
  })) as any;
  return response;
};

export const deletePage = async (id: string, pageId: string) => {
  const response = (await del<any>(`/projects/${id}/pages/${pageId}`)) as any;

  const cacheTag = getCacheTag(id);
  await evictCache(cacheTag);

  return response;
};

export const rollbackState = async (
  projectId: string,
  pageId: string,
  type: "deployment" | "page" | "deployment_page",
  id: string,
) => {
  const url = `/projects/${projectId}/pages/${pageId}/state/history?type=${type}&id=${id}`;
  const response = (await post<any>(url, {})) as PageStateResponse;
  return response;
};

export const getPageList = async (projectId: string, params?: PageParams) => {
  let url = `/projects/${projectId}/pages`;
  url += buildQueryString({ ...params });

  const response = (await get<PageListResponse>(url)) as PageListResponse;

  return response;
};

export const getPage = async (
  projectId: string,
  pageId: string,
  headers = {},
  init = {},
) => {
  const response = (await get<PageResponse>(
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
  const response = (await get<PageStateResponse>(
    `/projects/${projectId}/pages/${pageId}/state?pageLoadTimestamp=${pageLoadTimestamp}&history=${history}`,
    init,
  )) as PageStateResponse;

  return response;
};

export const getPageStateHistory = async (
  projectId: string,
  pageId: string,
  offset: number,
  limit: number,
) => {
  const response = (await get<PagingResponse<PageStateHistoryResponse>>(
    `/projects/${projectId}/pages/${pageId}/state/history?offset=${offset}&limit=${limit}`,
  )) as PagingResponse<PageStateHistoryResponse>;

  return response;
};

const getCacheTag = (projectId: string) => `/projects/${projectId}/pages`;
const getPageCacheTag = (projectId: string, pageId: string) =>
  `/projects/${projectId}/pages/${pageId}`;
