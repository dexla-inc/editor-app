import { EnvironmentTypes } from "@/requests/datasources/types";

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
  pageState: string;
};

export type DeploymentPageParams = {
  slug?: string;
  pageId?: string;
};
