import { get } from "@/utils/api";

type PageListResponse = {
  results: string[];
};

export const getPagesStream = async (projectId: string) => {
  const response = (await get<ReadableStream<Uint8Array>>(
    `/projects/${projectId}/automations/pages/stream`,
    {},
    true
  )) as ReadableStream<Uint8Array>;

  return response;
};

export const getPageList = async (projectId: string) => {
  const response = (await get<PageListResponse>(
    `/projects/${projectId}/pages/`,
    {}
  )) as PageListResponse;

  return response;
};
