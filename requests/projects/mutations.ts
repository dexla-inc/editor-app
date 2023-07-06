import { del, post, put } from "@/utils/api";
import { ProjectTypes } from "@/utils/projectTypes";

export type ProjectParams = {
  description: string;
  friendlyName: string;
  region?: string;
  type: ProjectTypes;
  industry?: string;
  similarCompany?: string;
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

export const updateProject = async (
  id: string,
  params: { friendlyName: string }
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
