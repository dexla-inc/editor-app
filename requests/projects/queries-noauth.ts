import { ProjectResponse } from "@/requests/projects/types";
import { getWithoutAuth } from "@/utils/apiNoAuth";

export type ProjectListResponse = {
  results: ProjectResponse[];
};

export const getProject = async (projectId: string) => {
  const response = (await getWithoutAuth<ProjectResponse>(
    `/projects/${projectId}`,
    {},
  )) as ProjectResponse;

  return response;
};

export const getByDomain = async (domain: string) => {
  const response = (await getWithoutAuth<ProjectResponse>(
    `/projects/${domain}/id`,
  )) as ProjectResponse;

  return response;
};
