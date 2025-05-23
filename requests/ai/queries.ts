import {
  AIRequestTypes,
  ChatHistoryMessage,
  EventSourceParams,
} from "@/requests/ai/types";
import { BrandingAITheme } from "@/requests/projects/types";
import { PagingResponse } from "@/requests/types";
import { usePropelAuthStore } from "@/stores/propelAuth";
import { baseURL, get } from "@/utils/api";
import { MantineThemeExtended } from "@/types/types";
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
  await fetchEventSource("/api/ai/page-list", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify({
      projectId,
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
  const token = usePropelAuthStore.getState().accessToken;
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
  const token = usePropelAuthStore.getState().accessToken;
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
  init = {},
) => {
  const response = await fetch("/api/ai/component-screenshot", {
    ...init,
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

  return json;
};

export const generateThemeFromScreenshot = async (
  description: string,
  base64Image: string,
  init = {},
): Promise<BrandingAITheme> => {
  const response = await fetch("/api/ai/theme-screenshot", {
    ...init,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      description,
      image: base64Image,
    }),
  });

  const json = await response.json();

  return json;
};

export const anyPrompt = async (
  model: string,
  prompt: string,
  image?: string,
  init = {},
) => {
  const response = await fetch("/api/ai/any-prompt", {
    ...init,
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
