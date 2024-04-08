import { EnvironmentTypes } from "@/requests/datasources/types";
import { Action } from "@/utils/actions";

export type DeploymentParams = {
  commitMessage?: string;
  taskId?: string;
  forceProduction: boolean;
};

export type DeploymentResponse = {
  id: string;
  projectId: string;
  environment: EnvironmentTypes;
  commitMessage: string;
  taskId: string;
  version: string;
  pages: DeploymentPage[];
};

export type DeploymentPage = {
  id: string;
  title: string;
  slug: string;
  authenticatedOnly: boolean;
  authenticatedUserRole?: string;
  pageState: string;
  actions?: Action[];
};

export type DeploymentPageParams = {
  page: string;
};
