import { ThemeResponse } from "@/requests/themes/types";
import { del, post } from "@/utils/api";

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

  // Determine which version of the function was called
  if (typeof projectIdOrProps === "string") {
    projectId = projectIdOrProps;
  } else {
    projectId = projectIdOrProps.projectId;
    params = projectIdOrProps.params;
  }

  const response = (await post<ThemeResponse>(
    `/projects/${projectId}/themes` +
      (websiteUrl ? `?websiteUrl=${websiteUrl}` : ""),
    params,
  )) as ThemeResponse;
  return response;
}

export const deleteTheme = async (id: string) => {
  const response = (await del<any>(`/projects/${id}/themes`)) as any;

  return response;
};
