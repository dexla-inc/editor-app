import { ProjectResponse } from "@/requests/projects/types";
import { getWithoutAuth } from "@/utils/apiNoAuth";

export type ProjectListResponse = {
  results: ProjectResponse[];
};

export const getProject = async (
  projectIdOrDomain: string,
  branding: boolean,
) => {
  const response = (await getWithoutAuth<ProjectResponse>(
    `/projects/${projectIdOrDomain}?branding=${branding}`,
    {},
  )) as ProjectResponse;

  return response;
};
