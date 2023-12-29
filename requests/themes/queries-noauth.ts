import { ThemeResponse } from "@/requests/themes/types";
import { getWithoutAuth } from "@/utils/apiNoAuth";

export const getTheme = async (projectId: string) => {
  const response = (await getWithoutAuth<ThemeResponse>(
    `/projects/${projectId}/themes`,
  )) as ThemeResponse;

  return response;
};
