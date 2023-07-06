import { PagingParams } from "@/requests/types";

export interface PageResponse extends PageBody {
  id: string;
  [key: string]: any;
}

export type PageListResponse = {
  results: PageResponse[];
};

export type PageBody = {
  title: string;
  slug: string;
  pageState?: string;
  isHome: boolean;
  authenticatedOnly: boolean;
  authenticatedUserRole?: string;
};

export type PagesResponse = {
  trackingId: string;
  homePageId: string;
  [key: string]: any;
};

export interface PageParams extends PagingParams {
  search?: string;
  isHome?: boolean;
  slug?: string;
}
