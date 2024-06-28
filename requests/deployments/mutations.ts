import {
  DeploymentPageHistory,
  DeploymentParams,
  DeploymentResponse,
} from "@/requests/deployments/types";
import { post, get } from "@/utils/api";
import { evictCache } from "@/requests/cache/queries-noauth";
import { PagingResponse } from "../types";

export const createDeployment = async (
  projectId: string,
  hostUrl: string,
  params: DeploymentParams,
) => {
  const response = (await post<DeploymentResponse>(
    `/projects/${projectId}/deployments`,
    params,
  )) as DeploymentResponse;

  const cacheTag = getCacheTag(hostUrl);
  const projectIdCacheTag = getCacheTag(projectId);

  await evictCache(cacheTag);
  await evictCache(projectIdCacheTag);

  return response;
};

export const promoteDeployment = async (projectId: string) => {
  const response = (await post<DeploymentResponse>(
    `/projects/${projectId}/deployments/promote`,
    {},
  )) as DeploymentResponse;

  const cacheTag = getCacheTag(projectId);
  await evictCache(cacheTag);

  return response;
};

export const getDeploymentPageHistory = async (
  projectId: string,
  pageId: string,
  offset: number,
  limit: number,
) => {
  const response = (await get<PagingResponse<DeploymentPageHistory>>(
    `/projects/${projectId}/deployments/history/${pageId}?offset=${offset}&limit=${limit}`,
  )) as PagingResponse<DeploymentPageHistory>;

  return response;
};

export const getRecentDeployment = async (projectId: string) => {
  const response = (await get<PagingResponse<DeploymentResponse>>(
    `/projects/${projectId}/deployments/recent`,
    {},
  )) as PagingResponse<DeploymentResponse>;

  return response;
};

const getCacheTag = (hostUrl: string) =>
  `/projects/${hostUrl}/deployments/page`;
