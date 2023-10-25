import {
  PageBody,
  PageResponse,
  PagesResponse,
  UpdatePageBody,
} from "@/requests/pages/types";
import { del, getAuthToken, post, put } from "@/utils/api";

export const createPage = async (params: PageBody, projectId: string) => {
  const response = (await post<PageResponse>(
    `/projects/${projectId}/pages`,
    params,
  )) as PageResponse;

  return response;
};

export const updatePage = async (
  params: UpdatePageBody,
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

export const createPageList = async (projectId: string) => {
  const accessToken = await getAuthToken();
  const response = await fetch("/api/ai/page-list", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      projectId,
      accessToken,
    }),
  });

  const json = await response.json();
  return json as { name: string; description: string }[];
};

export const updatePageState = async (
  pageState: PageBody["pageState"],
  projectId: string,
  pageId: string,
  setIsSaving: (isSaving: boolean) => void,
) => {
  setIsSaving(true);
  const response = (await put<any>(
    `/projects/${projectId}/pages/${pageId}/page-state`,
    {
      pageState,
    },
  )) as any;
  setIsSaving(false);
  return response;
};

export const deletePage = async (id: string, pageId: string) => {
  const response = (await del<any>(`/projects/${id}/pages/${pageId}`)) as any;

  return response;
};
