import { ThemeResponse } from "@/requests/themes/types";
import { get } from "@/utils/api";

// This saves theme from BrandFetch in back end
export const getTheme = async (projectId: string) => {
  const response = (await get<ThemeResponse>(
    `/projects/${projectId}/themes`,
  )) as ThemeResponse;

  return response;
};
