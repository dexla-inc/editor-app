import {
  LogicFlowParams,
  LogicFlowResponse,
} from "@/requests/logicflows/types";
import { PatchParams, SuccessResponse } from "@/requests/types";
import { del, patch, post } from "@/utils/api";
import { evictCache } from "@/requests/cache/queries-noauth";

export const createLogicFlow = async (
  projectId: string,
  params: LogicFlowParams,
) => {
  let url = `/projects/${projectId}/logicflows`;

  const response = (await post<LogicFlowResponse>(
    url,
    params,
  )) as LogicFlowResponse;

  const cacheTag = getCacheTag(projectId);
  await evictCache(cacheTag);

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

  const cacheTag = getCacheTag(projectId);
  await evictCache(cacheTag);

  return response;
};

export const deleteLogicFlow = async (projectId: string, id: string) => {
  let url = `/projects/${projectId}/logicflows/${id}`;

  const response = (await del<SuccessResponse>(url)) as SuccessResponse;

  const cacheTag = getCacheTag(projectId);
  await evictCache(cacheTag);

  return response;
};

const getCacheTag = (projectId: string) => `/projects/${projectId}/logicflows`;
