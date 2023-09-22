import { ThemeResponse } from "@/requests/themes/types";
import { get } from "@/utils/api";

// This saves theme from BrandFetch in back end
export const getTheme = async (projectId: string, websiteUrl?: string) => {
  const response = (await get<ThemeResponse>(
    `/projects/${projectId}/themes` +
      (websiteUrl ? `?websiteUrl=${websiteUrl}` : ""),
    {},
    false,
    false,
  )) as ThemeResponse;

  return response;
};
