import { get } from "@/utils/api";
import { getWithoutAuth } from "@/utils/apiNoAuth";
import { UserRoles } from "@/utils/dashboardTypes";
import { ProjectTypes } from "@/utils/projectTypes";
import { SuccessResponse } from "../datasources/types";

export type RegionTypes = "FRANCE_CENTRAL" | "US_CENTRAL" | "UK_SOUTH";

export type ProjectResponse = {
  id: string;
  name: string;
  friendlyName: string;
  region: {
    type: RegionTypes;
    name: string;
  };
  type: ProjectTypes;
  industry: string;
  description: string;
  similarCompany: string;
  accessLevel: UserRoles;
  isOwner: boolean;
  deployed: boolean;
  domain: string;
  subDomain: string;
};

type ProjectListResponse = {
  results: ProjectResponse[];
};

export const getProjects = async (
  search: string = "",
  offset: number = 0,
  limit: number = 10,
) => {
  const response = (await get<ProjectListResponse>(
    `/projects?search=${search}&offset=${offset}&limit=${limit}`,
    {},
  )) as ProjectListResponse;

  return response;
};

export const getProject = async (projectId: string) => {
  const response = (await getWithoutAuth<ProjectResponse>(
    `/projects/${projectId}`,
    {},
  )) as ProjectResponse;

  return response;
};

export const deploy = async (projectId: string, flag: boolean) => {
  const response = (await get<SuccessResponse>(
    `/projects/${projectId}/deploy?flag=${flag}`,
    {},
  )) as SuccessResponse;

  return response;
};

export const getByDomain = async (domain: string) => {
  const response = (await getWithoutAuth<ProjectResponse>(
    `/projects/${domain}/id`,
  )) as ProjectResponse;

  return response;
};
