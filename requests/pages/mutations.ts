import {
  PageAIResponse,
  PageBody,
  PageResponse,
  PageStateParams,
  PagesResponse,
} from "@/requests/pages/types";
import { del, post, put } from "@/utils/api";

export const createPage = async (params: PageBody, projectId: string) => {
  const response = (await post<PageResponse>(
    `/projects/${projectId}/pages`,
    params,
  )) as PageResponse;

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

  return response;
};

export const createPages = async (params: PageBody[], projectId: string) => {
  const response = (await post<PagesResponse>(
    `/projects/${projectId}/pages/many`,
    params,
  )) as PagesResponse;

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

export const updatePageState = async (
  state: PageStateParams["state"],
  projectId: string,
  pageId: string,
) => {
  const url = `/projects/${projectId}/pages/${pageId}/state`;
  const response = (await post<any>(url, { state })) as any;
  return response;
};

export const deletePage = async (id: string, pageId: string) => {
  const response = (await del<any>(`/projects/${id}/pages/${pageId}`)) as any;

  return response;
};
