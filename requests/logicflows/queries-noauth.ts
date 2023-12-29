import {
  LogicFlowPagingParams,
  LogicFlowResponse,
} from "@/requests/logicflows/types";
import { PagingResponse } from "@/requests/types";
import { getWithoutAuth } from "@/utils/apiNoAuth";
import { buildQueryString } from "@/utils/dashboardTypes";

export const listLogicFlows = async (
  projectId: string,
  params?: LogicFlowPagingParams,
) => {
  let url = `/projects/${projectId}/logicflows`;

  const { search, pageId, isGlobal, offset, limit } = params || {};

  url += buildQueryString({ search, pageId, isGlobal, offset, limit });

  const response = (await getWithoutAuth<PagingResponse<LogicFlowResponse>>(
    url,
  )) as PagingResponse<LogicFlowResponse>;

  return response;
};

export const getLogicFlow = async (projectId: string, id: string) => {
  let url = `/projects/${projectId}/logicflows/${id}`;

  const response = (await getWithoutAuth<LogicFlowResponse>(
    url,
  )) as LogicFlowResponse;

  return response;
};
