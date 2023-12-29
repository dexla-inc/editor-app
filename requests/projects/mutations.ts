import { RegionTypes } from "@/requests/projects/types";
import { PatchParams } from "@/requests/types";
import { del, getAuthToken, patch, post } from "@/utils/api";
import { buildQueryString } from "@/utils/dashboardTypes";
import { ProjectTypes } from "@/utils/projectTypes";

export interface ProjectParams extends ProjectUpdateParams {
  id: string;
  companyId: string;
  description: string;
  type: ProjectTypes;
  industry?: string;
  similarCompany?: string;
  customCode?: string;
}

export type ProjectResponse = {
  id: string;
  homePageId?: string;
  [key: string]: any;
};

export type ProjectUpdateParams = {
  friendlyName?: string;
  region?: RegionTypes;
  domain?: string;
  subDomain?: string;
  customCode?: string;
};

export const createProject = async (
  params: ProjectParams | { companyId: string },
  empty: boolean = false,
) => {
  let url = `/projects`;

  url += buildQueryString({ empty });

  const response = (await post<ProjectResponse>(
    url,
    params,
  )) as ProjectResponse;

  return response;
};

export const createEntities = async (params: ProjectParams, init = {}) => {
  const accessToken = await getAuthToken();
  const response = await fetch("/api/ai/entities", {
    ...init,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...params,
      appDescription: params.description,
      appIndustry: params.industry,
      accessToken,
    }),
  });

  const json = await response.json();
  return json as ProjectResponse;
};

export const patchProject = async (id: string, params: PatchParams[]) => {
  const response = (await patch<ProjectResponse>(
    `/projects/${id}`,
    params,
  )) as ProjectResponse;

  return response;
};

export const deleteProject = async (id: string) => {
  const response = (await del<any>(`/projects/${id}`)) as any;

  return response;
};
