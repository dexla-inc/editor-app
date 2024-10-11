import { PagingResponse } from "@/requests/types";
import {
  VariablePagingParams,
  VariableResponse,
} from "@/requests/variables/types";
import { buildQueryString } from "@/types/dashboardTypes";
import { get } from "@/utils/api";

export const listVariables = async (
  projectId: string,
  params?: VariablePagingParams,
) => {
  let url = `/projects/${projectId}/variables`;

  const { search, offset, limit } = params || {};

  url += buildQueryString({ search, offset, limit });

  const response = (await get<PagingResponse<VariableResponse>>(
    url,
  )) as PagingResponse<VariableResponse>;

  return response;
};

export const getVariable = async (projectId: string, id: string) => {
  let url = `/projects/${projectId}/variables/${id}`;

  const response = (await get<VariableResponse>(url)) as VariableResponse;

  return response;
};
