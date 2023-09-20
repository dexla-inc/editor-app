import { LanguageCodes, LanguageResponse } from "@/requests/languages/types";
import { get } from "@/utils/api";

export const getLanguages = async (projectId: string) => {
  const response = (await get<LanguageResponse>(
    `/projects/${projectId}/languages`,
  )) as LanguageResponse;

  return response;
};

export const getLanguageCodes = async (projectId: string) => {
  const response = (await get<LanguageCodes>(
    `/projects/${projectId}/languages/codes`,
  )) as LanguageCodes;

  return response;
};
