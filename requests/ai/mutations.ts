import { EventSourceParams, QueueResponse } from "@/requests/ai/types";
import { post } from "@/utils/api";

export const processAI = async (
  projectId: string,
  params: EventSourceParams,
) => {
  let url = `/projects/${projectId}/automations/process`;

  const response = (await post<QueueResponse>(url, {
    ...params,
  })) as QueueResponse;

  return response;
};
