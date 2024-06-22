import {
  DeploymentPage,
  DeploymentResponse,
} from "@/requests/deployments/types";
import { PagingResponse } from "@/requests/types";
import { getWithoutAuth } from "@/utils/apiLive";

export const getDeploymentPages = async (projectId: string) => {
  const response = (await getWithoutAuth<PagingResponse<DeploymentPage>>(
    `/projects/${projectId}/deployments/pages`,
  )) as PagingResponse<DeploymentPage>;

  return response;
};

export const getDeploymentPage = async (
  projectId: string,
  slug: string,
  cache?: RequestCache,
) => {
  const url = `/projects/${projectId}/deployments/page?slug=${slug}`;

  const response = (await getWithoutAuth<DeploymentPage>(
    url,
    undefined,
    cache,
  )) as DeploymentPage;

  return response;
};

export const listDeployments = async (projectId: string) => {
  const response = (await getWithoutAuth<PagingResponse<DeploymentResponse>>(
    `/projects/${projectId}`,
  )) as PagingResponse<DeploymentResponse>;

  return response;
};
