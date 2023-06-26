import { ThemeMutationParams, ThemeResponse } from "@/requests/themes/types";
import { del, post } from "@/utils/api";

export type SaveThemeProps = {
  params: ThemeMutationParams;
  projectId: string;
};

export const saveTheme = async ({ params, projectId }: SaveThemeProps) => {
  const response = (await post<ThemeResponse>(
    `/projects/${projectId}/themes`,
    params
  )) as ThemeResponse;

  return response;
};

export const deleteTheme = async (id: string) => {
  const response = (await del<any>(`/projects/${id}/themes`)) as any;

  return response;
};
