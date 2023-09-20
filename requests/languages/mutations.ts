import {
  Iso6391Codes,
  LanguageParams,
  LanguageResponse,
} from "@/requests/languages/types";
import { del, post } from "@/utils/api";

export const saveLanguages = async (
  projectId: string,
  params: LanguageParams,
) => {
  const response = (await post<LanguageResponse>(
    `/projects/${projectId}/languages`,
    params,
  )) as LanguageResponse;

  return response;
};

export const deleteLanguage = async (projectId: string, code: Iso6391Codes) => {
  const response = (await del<LanguageResponse>(
    `/projects/${projectId}/languages/${code}`,
  )) as LanguageResponse;

  return response;
};
