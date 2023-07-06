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

export type CustomComponentParams = {
  id?: string;
  type: string;
  name: string;
  scope: string;
  content: string;
  description: string;
};

export type CustomComponentResponse = {
  id: string;
  type: string;
  name: string;
  scope: string;
  content: string;
  description: string;
};

export const createCustomComponent = async ({
  values,
  projectId,
}: {
  values: CustomComponentParams;
  projectId: string;
}) => {
  const { name, ...params } = values;
  const response = (await post<CustomComponentResponse>(
    `/projects/${projectId}/components`,
    {
      ...params,
      description: name,
    }
  )) as CustomComponentResponse;

  return response;
};

export const deleteCustomComponent = async ({
  projectId,
  id,
}: {
  projectId: string;
  id: string;
}) => {
  const response = (await del<any>(
    `/projects/${projectId}/components/${id}`
  )) as any;

  return response;
};

export const updateComponent = async ({
  values,
  projectId,
}: {
  values: CustomComponentParams;
  projectId: string;
}) => {
  const { id, name, ...params } = values;
  const response = (await put<CustomComponentResponse>(
    `/projects/${projectId}/components/${id}`,
    params
  )) as CustomComponentResponse;

  return response;
};

export const deleteProject = async (id: string) => {
  const response = (await del<any>(`/projects/${id}`)) as any;

  return response;
};
