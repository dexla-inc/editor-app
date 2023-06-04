import { post } from "@/utils/api";

export type ProjectParams = {
  description: string;
};

export type ProjectResponse = {
  id: string;
  [key: string]: any;
};

export const createProject = async (params: ProjectParams) => {
  const response = (await post<ProjectResponse>(
    `/projects`,
    params
  )) as ProjectResponse;

  return response;
};
