import { TemplateResponse } from "@/requests/templates/types";
import { PagingParams, PagingResponse } from "@/requests/types";
import { getWithoutAuth } from "@/utils/apiNoAuth";
import { buildQueryString } from "@/utils/dashboardTypes";

export const listTemplates = async (params?: PagingParams) => {
  let url = `/templates`;

  const { offset, limit } = params || {};

  url += buildQueryString({ offset, limit });

  const response = (await getWithoutAuth<PagingResponse<TemplateResponse>>(
    url,
  )) as PagingResponse<TemplateResponse>;

  return response;
};

export const getTemplate = async (name: string, includeTiles: boolean) => {
  let url = `/templates/${name}?includeTiles=${includeTiles}`;

  const response = (await getWithoutAuth<TemplateResponse>(
    url,
  )) as TemplateResponse;

  return response;
};
