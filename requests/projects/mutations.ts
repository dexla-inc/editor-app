import { post, put } from "@/utils/api";

export type ProjectParams = {
  description: string;
};

export type ProjectResponse = {
  id: string;
  [key: string]: any;
};

export const createProject = async (params: ProjectParams) => {
  const response = (await post<ProjectResponse>(
    `/projects`,
    params
  )) as ProjectResponse;

  return response;
};

export type PageParams = {
  title: string;
  slug: string;
  pageState?: string;
  isHome: boolean;
  authenticatedOnly: boolean;
  authenticatedUserRole?: string;
};

export type PagesResponse = {
  trackingId: string;
  [key: string]: any;
};

export const createPages = async (params: PageParams[], projectId: string) => {
  const response = (await post<PagesResponse>(
    `/projects/${projectId}/pages/many`,
    params
  )) as PagesResponse;

  return response;
};

export const updatePageState = async (
  pageState: PageParams["pageState"],
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
