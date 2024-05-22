import {
  PageAIResponse,
  PageBody,
  PageConfigProps,
  PageResponse,
  PageStateParams,
  PageStateResponse,
  PagesResponse,
} from "@/requests/pages/types";
import { del, patch, post, put } from "@/utils/api";
import { evictCache } from "../cache/queries-noauth";
import { PatchParams } from "../types";

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
  projectId: string,
  pageId: string,
  pageLoadTimestamp: number | undefined,
  history: number | null,
  //description: PageStateParams["description"],
) => {
  const url = `/projects/${projectId}/pages/${pageId}/state?pageLoadTimestamp=${pageLoadTimestamp}&history=${history}`;
  const response = (await put<any>(url, {
    state,
  })) as any;
  return response;
};

export const deletePage = async (id: string, pageId: string) => {
  const response = (await del<any>(`/projects/${id}/pages/${pageId}`)) as any;

  const cacheTag = getCacheTag(id);
  await evictCache(cacheTag);

  return response;
};

export const rollbackPageState = async (
  projectId: string,
  pageId: string,
  pageHistoryId: string,
) => {
  const url = `/projects/${projectId}/pages/${pageId}/state/history/${pageHistoryId}`;
  const response = (await post<any>(url, {})) as PageStateResponse;
  return response;
};

const getCacheTag = (projectId: string) => `/projects/${projectId}/pages`;
const getPageCacheTag = (projectId: string, pageId: string) =>
  `/projects/${projectId}/pages/${pageId}`;
