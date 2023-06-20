import { get } from "@/utils/api";

export type PageResponse = {
  id: string;
  title: string;
  pageState?: string;
  [key: string]: any;
};

type PageListResponse = {
  results: PageResponse[];
};

export type CustomComponentResponse = {
  id: string;
  type: string;
  name: string;
  scope: string;
  content: string;
  description: string;
};

type CustomComponentListResponse = {
  results: CustomComponentResponse[];
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

export const getPageList = async (projectId: string) => {
  const response = (await get<PageListResponse>(
    `/projects/${projectId}/pages/`,
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

export const getComponentList = async (projectId: string) => {
  const response = (await get<CustomComponentListResponse>(
    `/projects/${projectId}/components`,
    {}
  )) as CustomComponentListResponse;

  return response;
};
