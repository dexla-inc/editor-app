import {
  AIRequestTypes,
  ChatHistoryMessage,
  EventSourceParams,
} from "@/requests/ai/types";
import { PagingResponse } from "@/requests/types";
import { MantineThemeExtended } from "@/stores/editor";
import { baseURL, get, getAuthToken } from "@/utils/api";
import {
  EventSourceMessage,
  fetchEventSource,
} from "@microsoft/fetch-event-source";

export const postEventSourceComponents = async (
  projectId: string,
  params: EventSourceParams,
  onmessage?: (ev: EventSourceMessage) => void,
  onerror?: (err: any) => number | null | undefined | void,
  onopen?: (response: Response) => Promise<void>,
  onclose?: () => void,
) => {
  await fetchEventSource("/api/ai/components", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify(params),
    onerror: onerror,
    onmessage: onmessage,
    onopen: onopen,
    onclose: onclose,
  });
};

export const getPagesEventSource = async (
  projectId: string,
  count: number = 5,
  excludedCsv?: string,
  onmessage?: (ev: EventSourceMessage) => void,
  onerror?: (err: any) => number | null | undefined | void,
  onopen?: (response: Response) => Promise<void>,
  onclose?: () => void,
) => {
  const token = await getAuthToken();

  await fetchEventSource("/api/ai/page-list", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify({
      projectId,
      accessToken: token,
    }),
    onerror: onerror,
    onmessage: onmessage,
    onopen: onopen,
    onclose: onclose,
  });
};

export const postPageEventSource = async (
  projectId: string,
  pageName: string,
  onmessage?: (ev: EventSourceMessage) => void,
  onerror?: (err: any) => number | null | undefined | void,
  onopen?: (response: Response) => Promise<void>,
  onclose?: () => void,
  type?: AIRequestTypes | undefined,
  description?: string | undefined,
) => {
  const token = await getAuthToken();
  let url = `${baseURL}/projects/${projectId}/automations/content`;

  await fetchEventSource(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      type: type,
      description: description,
      pageName: pageName,
    }),
    onerror: onerror,
    onmessage: onmessage,
    onopen: onopen,
    onclose: onclose,
  });
};

export const postEventSource = async (
  projectId: string,
  params: EventSourceParams,
  onmessage?: (ev: EventSourceMessage) => void,
  onerror?: (err: any) => number | null | undefined | void,
  onopen?: (response: Response) => Promise<void>,
  onclose?: () => void,
) => {
  const token = await getAuthToken();
  let url = `${baseURL}/projects/${projectId}/automations/content`;

  await fetchEventSource(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(params),
    onerror: onerror,
    onmessage: onmessage,
    onopen: onopen,
    onclose: onclose,
  });
};

export const getChatHistoryList = async (projectId: string) => {
  let url = `/projects/${projectId}/automations/history`;

  const response = (await get<PagingResponse<ChatHistoryMessage>>(
    url,
  )) as PagingResponse<ChatHistoryMessage>;

  return response;
};

export const generateStructureFromScreenshot = async (
  description: string,
  theme: MantineThemeExtended,
  base64Image?: string,
) => {
  const response = await fetch("/api/ai/component-screenshot", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      description,
      theme,
      image: base64Image,
    }),
  });

  const json = await response.json();
  console.log(json);

  return json;
};

export const anyPrompt = async (
  model: string,
  prompt: string,
  image?: string,
) => {
  const response = await fetch("/api/ai/any-prompt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      prompt,
      image,
    }),
  });
  const clonedResponse = response.clone();

  try {
    const json = await response.json();
    return json;
  } catch (error) {
    const text = await clonedResponse.text();
    return text;
  }
};
