import {
  PageListResponse,
  PageParams,
  PageResponse,
} from "@/requests/pages/types";
import { get } from "@/utils/api";

export const getPageList = async (projectId: string, params?: PageParams) => {
  let queryParams = "";

  if (params) {
    const urlParams = new URLSearchParams();
    if (params.isHome) {
      urlParams.append("isHome", String(params.isHome));
    }
    if (params.slug) {
      urlParams.append("slug", encodeURIComponent(params.slug));
    }
    queryParams = `?${urlParams.toString()}`;
  }

  const response = (await get<PageListResponse>(
    `/projects/${projectId}/pages/${queryParams}`,
    {}
  )) as PageListResponse;

  return response;
};

export const getPage = async (projectId: string, pageId: string) => {
  const response = (await get<PageResponse>(
    `/projects/${projectId}/pages/${pageId}`,
    {}
  )) as PageResponse;

  return response;
};

export const getPagesStream = async (
  projectId: string,
  count: number = 5,
  excludedCsv?: string
) => {
  const response = (await get<ReadableStream<Uint8Array>>(
    `/projects/${projectId}/automations/pages/stream-revision?count=${count}&excluded=${excludedCsv}`,
    {},
    true
  )) as ReadableStream<Uint8Array>;

  return response;
};

export const getPageStream = async (projectId: string, pageName: string) => {
  const response = (await get<ReadableStream<Uint8Array>>(
    `/projects/${projectId}/automations/${encodeURIComponent(
      pageName
    )}/stream-revision`,
    {},
    true
  )) as ReadableStream<Uint8Array>;

  return response;
};
