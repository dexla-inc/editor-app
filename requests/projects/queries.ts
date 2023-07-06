import { get } from "@/utils/api";
import { ProjectTypes } from "@/utils/projectTypes";

type RegionTypes = "FranceCentral" | "UsCentral" | "UkSouth";

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
