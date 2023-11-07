import { EventSourceParams } from "@/requests/ai/types";
import { post } from "@/utils/api";

export const generateStructure = async <T>(
  projectId: string,
  params: EventSourceParams,
) => {
  let url = `/projects/${projectId}/automations/json`;

  const response = (await post<T>(url, {
    ...params,
  })) as T;

  return response;
};
