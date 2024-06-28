import { EnvironmentTypes } from "@/requests/datasources/types";
import { Action } from "@/utils/actions";
import { ProjectResponse } from "../projects/types";
import { ThemeResponse } from "../themes/types";
import { IResponse } from "../types";

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
  canPromote: boolean;
  pages: DeploymentPage[];
  project: ProjectResponse;
  updatedBy: AuditInfo;
};

type AuditInfo = {
  name: string;
  date: number;
};

export type DeploymentPage = IResponse & {
  id: string;
  projectId: string;
  title: string;
  slug: string;
  authenticatedOnly: boolean;
  authenticatedUserRole?: string;
  pageState: string;
  actions?: Action[];
  project: ProjectResponse;
  branding: ThemeResponse;
};

export type DeploymentPageHistory = IResponse & {
  id: string;
  title: string;
  slug: string;
  authenticatedOnly: boolean;
  authenticatedUserRole?: string;
  pageId: string;
  created: number;
};

export type DeploymentPageParams = {
  page: string;
};
