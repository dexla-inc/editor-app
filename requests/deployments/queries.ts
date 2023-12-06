import {
  DeploymentPage,
  DeploymentPageParams,
  DeploymentResponse,
} from "@/requests/deployments/types";
import { PagingResponse } from "@/requests/types";
import { getWithoutAuth } from "@/utils/apiNoAuth";
import { buildQueryString } from "@/utils/dashboardTypes";

export const getMostRecentDeployment = async (projectId: string) => {
  const response = (await getWithoutAuth<DeploymentResponse>(
    `/projects/${projectId}/deployments/recent`,
  )) as DeploymentResponse;

  return response;
};

export const getMostRecentDeploymentByPage = async (
  projectId: string,
  params: DeploymentPageParams,
) => {
  let url = `/projects/${projectId}/deployments/recent/page`;
  url += buildQueryString({ ...params });
  const response = (await getWithoutAuth<DeploymentPage>(
    url,
  )) as DeploymentPage;

  return response;
};

export const listDeployments = async (projectId: string) => {
  const response = (await getWithoutAuth<PagingResponse<DeploymentPage>>(
    `/projects/${projectId}`,
  )) as PagingResponse<DeploymentPage>;

  return response;
};
