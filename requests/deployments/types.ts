import {
  DataSourceResponse,
  EnvironmentTypes,
} from "@/requests/datasources/types";
import { Action } from "@/utils/actions";
import { ProjectResponse } from "@/requests/projects/types";
import { ThemeResponse } from "@/requests/themes/types";
import { IResponse } from "@/requests/types";
import { VariableResponse } from "@/requests/variables/types";
import { LogicFlowResponse } from "@/requests/logicflows/types";

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
  description: string;
  slug: string;
  authenticatedOnly: boolean;
  authenticatedUserRole?: string;
  pageState: string;
  actions?: Action[];
  project: ProjectResponse;
  branding: ThemeResponse;
  datasources: DataSourceResponse[];
  variables: VariableResponse[];
  logicFlows: LogicFlowResponse[];
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
