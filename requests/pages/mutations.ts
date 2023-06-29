import { PageBody, PagesResponse } from "@/requests/pages/types";
import { post, put } from "@/utils/api";

export const createPages = async (params: PageBody[], projectId: string) => {
  const response = (await post<PagesResponse>(
    `/projects/${projectId}/pages/many`,
    params
  )) as PagesResponse;

  return response;
};

export const updatePageState = async (
  pageState: PageBody["pageState"],
  projectId: string,
  pageId: string
) => {
  const response = (await put<any>(
    `/projects/${projectId}/pages/${pageId}/page-state`,
    {
      pageState,
    }
  )) as any;

  return response;
};
