import { TemplateResponse } from "@/requests/templates/types";
import { PagingParams, PagingResponse } from "@/requests/types";
import { getWithoutAuth } from "@/utils/apiNoAuth";
import { buildQueryString } from "@/utils/dashboardTypes";

export const listTiles = async (id: string, params?: PagingParams) => {
  let url = `/templates/${id}/tiles`;

  const { offset, limit } = params || {};

  url += buildQueryString({ offset, limit });

  const response = (await getWithoutAuth<PagingResponse<TemplateResponse>>(
    url,
  )) as PagingResponse<TemplateResponse>;

  return response;
};

export const getTile = async (id: string) => {
  const url = `/templates/${id}/tiles`;

  const response = (await getWithoutAuth<TemplateResponse>(
    url,
  )) as TemplateResponse;

  return response;
};
