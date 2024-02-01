import { ProjectResponse } from "@/requests/projects/types";
import { getWithoutAuth } from "@/utils/apiNoAuth";

export type ProjectListResponse = {
  results: ProjectResponse[];
};

export const getProject = async (projectIdOrDomain: string) => {
  const response = (await getWithoutAuth<ProjectResponse>(
    `/projects/${projectIdOrDomain}`,
    {},
  )) as ProjectResponse;

  return response;
};
