import {
  PageListResponse,
  PageParams,
  PageResponse,
  StreamTypes,
} from "@/requests/pages/types";
import { baseURL, get, getAuthToken } from "@/utils/api";
import { buildQueryString } from "@/utils/dashboardTypes";
import {
  EventSourceMessage,
  fetchEventSource,
} from "@microsoft/fetch-event-source";

export const getPageList = async (projectId: string, params?: PageParams) => {
  let url = `/projects/${projectId}/pages`;
  url += buildQueryString({ ...params });

  const response = (await get<PageListResponse>(url, {})) as PageListResponse;

  return response;
};

export const getPage = async (projectId: string, pageId: string) => {
  const response = (await get<PageResponse>(
    `/projects/${projectId}/pages/${pageId}`,
    {}
  )) as PageResponse;

  return response;
};

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
    url += buildQueryString({ description, type });
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
