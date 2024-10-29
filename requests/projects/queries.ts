import { ProjectListResponse } from "@/requests/projects/types";
import { SuccessResponse } from "@/requests/types";
import { get } from "@/utils/api";

export const getProjects = async (
  companyId: string,
  search: string = "",
  offset: number = 0,
  limit: number = 25,
) => {
  const response = (await get<ProjectListResponse>(
    `/projects?companyId=${companyId}&search=${search}&offset=${offset}&limit=${limit}`,
    {},
  )) as ProjectListResponse;

  return response;
};

export const deploy = async (projectId: string, flag: boolean) => {
  const response = (await get<SuccessResponse>(
    `/projects/${projectId}/deploy?flag=${flag}`,
    {},
  )) as SuccessResponse;

  return response;
};
