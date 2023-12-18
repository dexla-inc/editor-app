import {
  CustomComponentParams,
  CustomComponentResponse,
} from "@/requests/components/types";
import { del, post } from "@/utils/api";

export const upsertCustomComponent = async ({
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
