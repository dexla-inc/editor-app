import { del, post, put } from "@/utils/api";

export type CustomComponentParams = {
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

export const updateCustomComponent = async ({
  values,
  projectId,
  id,
}: {
  values: CustomComponentParams;
  projectId: string;
  id: string;
}) => {
  const { name, ...params } = values;
  const response = (await put<CustomComponentResponse>(
    `/projects/${projectId}/components/${id}`,
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

export const deleteProject = async (id: string) => {
  const response = (await del<any>(`/projects/${id}`)) as any;

  return response;
};
