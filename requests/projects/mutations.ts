import { RegionTypes } from "@/requests/projects/queries";
import { PatchParams } from "@/requests/types";
import { del, getBearerTokenHeaderValue, patch, post } from "@/utils/api";
import { ProjectTypes } from "@/utils/projectTypes";

export interface ProjectParams extends ProjectUpdateParams {
  description: string;
  type: ProjectTypes;
  industry?: string;
  similarCompany?: string;
}

export type ProjectResponse = {
  id: string;
  [key: string]: any;
};

export type ProjectUpdateParams = {
  friendlyName?: string;
  region?: RegionTypes;
  domain?: string;
  subDomain?: string;
};

export const createProject = async (params: ProjectParams) => {
  const response = (await post<ProjectResponse>(
    `/projects`,
    params,
  )) as ProjectResponse;

  return response;
};

export const createEntitiesAndProject = async (params: ProjectParams) => {
  const bearerToken = await getBearerTokenHeaderValue();
  const response = await fetch("/api/ai/entities", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: bearerToken,
    },
    body: JSON.stringify({
      ...params,
      appDescription: params.description,
      appIndustry: params.industry,
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
