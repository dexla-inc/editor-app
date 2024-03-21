import {
  DeploymentPage,
  DeploymentResponse,
} from "@/requests/deployments/types";
import { PagingResponse } from "@/requests/types";
import { getWithoutAuth } from "@/utils/apiNoAuth";

export const getMostRecentDeployment = async (projectId: string) => {
  const response = (await getWithoutAuth<DeploymentResponse>(
    `/projects/${projectId}/deployments/recent`,
  )) as DeploymentResponse;

  return response;
};

export const listDeployments = async (projectId: string) => {
  const response = (await getWithoutAuth<PagingResponse<DeploymentPage>>(
    `/projects/${projectId}`,
  )) as PagingResponse<DeploymentPage>;

  return response;
};
