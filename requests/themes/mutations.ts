import { BrandingAITheme } from "@/requests/projects/types";
import { ThemeResponse } from "@/requests/themes/types";
import { del, post } from "@/utils/api";
import { buildQueryString } from "@/types/dashboardTypes";

export type SaveThemeProps = {
  params: ThemeResponse;
  projectId: string;
};

export async function saveTheme(
  projectId: string,
  params: ThemeResponse,
  websiteUrl?: string,
): Promise<ThemeResponse>;

export async function saveTheme({
  params,
  projectId,
}: SaveThemeProps): Promise<ThemeResponse>;

export async function saveTheme(
  projectIdOrProps: string | SaveThemeProps,
  params?: ThemeResponse,
  websiteUrl?: string,
): Promise<ThemeResponse> {
  let projectId;

  if (typeof projectIdOrProps === "string") {
    projectId = projectIdOrProps;
  } else {
    projectId = projectIdOrProps.projectId;
    params = projectIdOrProps.params;
  }

  let url = `/projects/${projectId}/themes`;
  url += buildQueryString({ websiteUrl });

  const response = (await post<ThemeResponse>(url, params)) as ThemeResponse;

  return response;
}

export async function saveBasicTheme(
  projectId: string,
  params: BrandingAITheme,
): Promise<ThemeResponse> {
  const response = (await post<ThemeResponse>(
    `/projects/${projectId}/themes/basic`,
    params,
  )) as ThemeResponse;

  return response;
}

export const deleteTheme = async (id: string) => {
  const response = (await del<any>(`/projects/${id}/themes`)) as any;

  return response;
};
