import { del, post, put } from "@/utils/api";
import { ProjectTypes } from "@/utils/projectTypes";
import { RegionTypes } from "./queries";

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
  friendlyName: string;
  region?: RegionTypes;
};

export const createProject = async (params: ProjectParams) => {
  const response = (await post<ProjectResponse>(
    `/projects`,
    params
  )) as ProjectResponse;

  return response;
};

export const updateProject = async (
  id: string,
  params: ProjectUpdateParams
) => {
  const response = (await put<ProjectResponse>(
    `/projects/${id}`,
    params
  )) as ProjectResponse;

  return response;
};

export const deleteProject = async (id: string) => {
  const response = (await del<any>(`/projects/${id}`)) as any;

  return response;
};
