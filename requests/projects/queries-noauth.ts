import { ProjectResponse } from "@/requests/projects/types";
import { getWithoutAuth } from "@/utils/apiLive";

export type ProjectListResponse = {
  results: ProjectResponse[];
};

export const getProject = async (
  projectIdOrDomain: string,
  branding: boolean,
) => {
  const url = `/projects/${projectIdOrDomain}?branding=${branding}`;
  const response = (await getWithoutAuth<ProjectResponse>(
    url,
    {},
  )) as ProjectResponse;

  return response;
};
