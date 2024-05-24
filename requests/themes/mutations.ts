import { BrandingAITheme } from "@/requests/projects/types";
import { ThemeResponse } from "@/requests/themes/types";
import { del, patch, post } from "@/utils/api";
import { buildQueryString } from "@/types/dashboardTypes";
import { evictCache } from "@/requests/cache/queries-noauth";
import { PatchParams } from "../types";
import { prepareUserThemeLive } from "@/utils/prepareUserThemeLive";
import { useThemeStore } from "@/stores/theme";

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

  const theme = prepareUserThemeLive(response);

  const setTheme = useThemeStore.getState().setTheme;
  setTheme(theme);

  const cacheTag = getCacheTag(projectId);
  await evictCache(cacheTag);

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

export const patchTheme = async (id: string, params: PatchParams[]) => {
  const url = `/projects/${id}/themes`;
  const response = (await patch<ThemeResponse>(url, params)) as ThemeResponse;

  const cacheTag = getCacheTag(id);
  await evictCache(cacheTag);

  return response;
};

export const deleteTheme = async (id: string) => {
  const response = (await del<any>(`/projects/${id}/themes`)) as any;

  return response;
};

const getCacheTag = (projectId: string) => `/projects/${projectId}`;
