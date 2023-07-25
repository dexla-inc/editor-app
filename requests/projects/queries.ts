import { get } from "@/utils/api";
import { ProjectTypes } from "@/utils/projectTypes";

type RegionTypes = "FRANCE_CENTRAL" | "US_CENTRAL" | "UK_SOUTH";

export type UserRoles = "MEMBER" | "ADMIN" | "OWNER" | "GUEST" | "DEXLA_ADMIN";

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
};

type ProjectListResponse = {
  results: ProjectResponse[];
};

export const getProjects = async (
  search: string = "",
  offset: number = 0,
  limit: number = 10
) => {
  const response = (await get<ProjectListResponse>(
    `/projects?search=${search}&offset=${offset}&limit=${limit}`,
    {}
  )) as ProjectListResponse;

  return response;
};

export const getProject = async (projectId: string) => {
  const response = (await get<ProjectResponse>(
    `/projects/${projectId}`,
    {}
  )) as ProjectResponse;

  return response;
};
