import { TemplateParams, TemplateResponse } from "@/requests/templates/types";
import { SuccessResponse } from "@/requests/types";
import { del, post, put } from "@/utils/api";

export const createTemplate = async (
  companyId: string,
  params: TemplateParams,
) => {
  const url = `/templates?companyId=${companyId}`;

  const response = (await post<TemplateResponse>(
    url,
    params,
  )) as TemplateResponse;

  return response;
};

export const updateTemplate = async (
  companyId: string,
  id: string,
  params: TemplateParams,
) => {
  const url = `/templates/${id}?companyId=${companyId}`;

  const response = (await put<TemplateResponse>(
    url,
    params,
  )) as TemplateResponse;

  return response;
};

export const deleteTemplate = async (companyId: string, id: string) => {
  const url = `/templates/${id}?companyId=${companyId}`;

  const response = (await del<SuccessResponse>(url)) as SuccessResponse;

  return response;
};
