import {
  LogicFlowParams,
  LogicFlowResponse,
} from "@/requests/logicflows/types";
import { PatchParams } from "@/requests/types";
import { del, patch, post } from "@/utils/api";
import { SuccessResponse } from "@/requests/datasources/types";

export const createLogicFlow = async (
  projectId: string,
  params: LogicFlowParams,
) => {
  let url = `/projects/${projectId}/logicflows`;

  const response = (await post<LogicFlowResponse>(
    url,
    params,
  )) as LogicFlowResponse;

  return response;
};

export const patchLogicFlow = async (
  projectId: string,
  id: string,
  params: PatchParams[],
) => {
  let url = `/projects/${projectId}/logicflows/${id}`;

  const response = (await patch<LogicFlowResponse>(
    url,
    params,
  )) as LogicFlowResponse;

  return response;
};

export const deleteLogicFlow = async (projectId: string, id: string) => {
  let url = `/projects/${projectId}/logicflows/${id}`;

  const response = (await del<SuccessResponse>(url)) as SuccessResponse;

  return response;
};
