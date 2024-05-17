import { ThemeResponse } from "@/requests/themes/types";
import { getWithoutAuth } from "@/utils/apiLive";

export const getTheme = async (projectId: string) => {
  const response = (await getWithoutAuth<ThemeResponse>(
    `/projects/${projectId}/themes`,
  )) as ThemeResponse;

  return response;
};
