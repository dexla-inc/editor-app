import { TemplateParams, TemplateResponse } from "@/requests/templates/types";
import { SuccessResponse } from "@/requests/types";
import { del, post } from "@/utils/api";

export const upsertTemplate = async (
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

export const deleteTemplate = async (companyId: string, id: string) => {
  const url = `/templates/${id}?companyId=${companyId}`;

  const response = (await del<SuccessResponse>(url)) as SuccessResponse;

  return response;
};
