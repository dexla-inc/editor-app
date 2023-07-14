import { ChatHistoryMessage, StreamTypes } from "@/requests/ai/types";
import { PagingResponse } from "@/requests/types";
import { baseURL, get, getAuthToken } from "@/utils/api";
import { buildQueryString } from "@/utils/dashboardTypes";
import {
  EventSourceMessage,
  fetchEventSource,
} from "@microsoft/fetch-event-source";

export const getPagesEventSource = async (
  projectId: string,
  count: number = 5,
  excludedCsv?: string,
  onmessage?: (ev: EventSourceMessage) => void,
  onerror?: (err: any) => number | null | undefined | void,
  onopen?: (response: Response) => Promise<void>
) => {
  const token = await getAuthToken();
  const url = `${baseURL}/projects/${projectId}/automations/pages/stream?count=${count}&excluded=${excludedCsv}`;

  await fetchEventSource(url, {
    method: "GET",
    headers: {
      "Content-Type": "text/event-stream",
      Authorization: "Bearer " + token,
    },
    onerror: onerror,
    onmessage: onmessage,
    onopen: onopen,
  });
};

export const getPageEventSource = async (
  projectId: string,
  pageName: string,
  onmessage?: (ev: EventSourceMessage) => void,
  onerror?: (err: any) => number | null | undefined | void,
  onopen?: (response: Response) => Promise<void>,
  onclose?: () => void,
  type?: StreamTypes | undefined,
  description?: string | undefined
) => {
  const token = await getAuthToken();
  const encodedPagename = encodeURIComponent(pageName);
  let url = `${baseURL}/projects/${projectId}/automations/${encodedPagename}/stream`;

  if (description) {
    url += buildQueryString({ description });
  }

  await fetchEventSource(url, {
    method: "GET",
    headers: {
      "Content-Type": "text/event-stream",
      Authorization: "Bearer " + token,
    },
    onerror: onerror,
    onmessage: onmessage,
    onopen: onopen,
    onclose: onclose,
  });
};

export const getChatHistoryList = async (projectId: string) => {
  let url = `/projects/${projectId}/automations/history`;

  const response = (await get<PagingResponse<ChatHistoryMessage>>(
    url
  )) as PagingResponse<ChatHistoryMessage>;

  return response;
};
