import {
  DeploymentParams,
  DeploymentResponse,
} from "@/requests/deployments/types";
import { post } from "@/utils/api";

export const createDeployment = async (
  projectId: string,
  params: DeploymentParams,
) => {
  const response = (await post<DeploymentResponse>(
    `/projects/${projectId}/deployments`,
    params,
  )) as DeploymentResponse;

  return response;
};

export const promoteDeployment = async (projectId: string) => {
  const response = (await post<DeploymentResponse>(
    `/projects/${projectId}/deployments/promote`,
    {},
  )) as DeploymentResponse;

  return response;
};
