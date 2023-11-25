import { TemplateResponse } from "@/requests/templates/types";
import { PagingParams, PagingResponse } from "@/requests/types";
import { get } from "@/utils/api";
import { buildQueryString } from "@/utils/dashboardTypes";

export const listTemplates = async (
  companyId: string,
  params?: PagingParams,
) => {
  let url = `/templates`;

  const { offset, limit } = params || {};

  url += buildQueryString({ companyId, offset, limit });

  const response = (await get<PagingResponse<TemplateResponse>>(
    url,
  )) as PagingResponse<TemplateResponse>;

  return response;
};

export const getTemplate = async (companyId: string, id: string) => {
  let url = `/templates/${id}?companyId=${companyId}`;

  const response = (await get<TemplateResponse>(url)) as TemplateResponse;

  return response;
};
