import { del, post, put } from "@/utils/api";

export type CustomComponentParams = {
  type: string;
  name: string;
  scopes: string;
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
  companyId,
}: {
  values: CustomComponentParams;
  projectId: string;
  companyId: string;
}) => {
  const { name, ...params } = values;
  const response = (await post<CustomComponentResponse>(
    `/projects/${projectId}/components?companyId=${companyId}`,
    {
      ...params,
      description: name,
    },
  )) as CustomComponentResponse;

  return response;
};

export const updateComponent = async ({
  values,
  projectId,
  companyId,
  id,
}: {
  values: CustomComponentParams;
  projectId: string;
  companyId: string;
  id: string;
}) => {
  const { name, ...params } = values;
  const response = (await put<CustomComponentResponse>(
    `/projects/${projectId}/components/${id}?companyId=${companyId}`,
    {
      ...params,
      description: name,
    },
  )) as CustomComponentResponse;

  return response;
};

export const deleteCustomComponent = async ({
  projectId,
  companyId,
  id,
}: {
  projectId: string;
  companyId: string;
  id: string;
}) => {
  const response = (await del<any>(
    `/projects/${projectId}/components/${id}?companyId=${companyId}`,
  )) as any;

  return response;
};
