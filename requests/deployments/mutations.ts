import {
  DeploymentParams,
  DeploymentResponse,
} from "@/requests/deployments/types";
import { post } from "@/utils/api";
import { evictCache } from "@/requests/cache/queries-noauth";

export const createDeployment = async (
  projectId: string,
  params: DeploymentParams,
) => {
  const response = (await post<DeploymentResponse>(
    `/projects/${projectId}/deployments`,
    params,
  )) as DeploymentResponse;

  const cacheTag = getCacheTag(projectId);
  await evictCache(cacheTag);

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

const getCacheTag = (projectId: string) =>
  `/projects/${projectId}/deployments/page`;
