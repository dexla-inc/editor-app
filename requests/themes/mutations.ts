import { ThemeMutationParams, ThemeResponse } from "@/requests/themes/types";
import { post } from "@/utils/api";

export const saveTheme = async (
  params: ThemeMutationParams,
  projectId: string
) => {
  const response = (await post<ThemeMutationParams>(
    `/projects/${projectId}/themes`,
    params
  )) as ThemeResponse;

  return response;
};
