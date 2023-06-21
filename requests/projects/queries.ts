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

export const getTheme = async (projectId: string, websiteUrl?: string) => {
  const response = (await get<ThemeResponse>(
    `/projects/${projectId}/themes?websiteUrl=${websiteUrl}`,
    {}
  )) as ThemeResponse;

  return response;
};

export type ThemeQueryParams = {
  websiteUrl?: string;
};

export type ThemeMutationParams = {
  colors: Color[];
  fonts: Font[];
  responsiveBreakpoints: ResponsiveBreakpoint[];
  faviconUrl: string;
  logoUrl: string;
  defaultBorderRadius: string;
  defaultSpacing: string;
};

export interface ThemeResponse extends ThemeMutationParams {
  id: string;
  trackingId: string;
}

type Color = {
  name: string;
  friendlyName: string;
  hex: string;
  brightness: number;
  isDefault: boolean;
};

type Font = {
  fontFamily: string;
  tag: string;
  fontWeight: string;
  fontSize: string;
  lineHeight: string;
  letterSpacing: string;
};

type ResponsiveBreakpoint = {
  type: string;
  breakpoint: string;
};
