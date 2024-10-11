import {
  LogicFlowPagingParams,
  LogicFlowResponse,
} from "@/requests/logicflows/types";
import { PagingResponse } from "@/requests/types";
import { buildQueryString } from "@/types/dashboardTypes";
import { get } from "@/utils/api";

export const listLogicFlows = async (
  projectId: string,
  params?: LogicFlowPagingParams,
) => {
  let url = `/projects/${projectId}/logicflows`;

  const { search, pageId, isGlobal, offset, limit } = params || {};

  url += buildQueryString({ search, pageId, isGlobal, offset, limit });

  const response = (await get<PagingResponse<LogicFlowResponse>>(
    url,
  )) as PagingResponse<LogicFlowResponse>;

  return response;
};

export const getLogicFlow = async (projectId: string, id: string) => {
  let url = `/projects/${projectId}/logicflows/${id}`;

  const response = (await get<LogicFlowResponse>(url)) as LogicFlowResponse;

  return response;
};
