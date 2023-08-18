import { PagingParams } from "@/requests/types";
import { AppTypes } from "@/utils/dashboardTypes";

export interface PageResponse extends PageBody {
  id: string;
  [key: string]: any;
}

export type PageListResponse = {
  results: PageResponse[];
};

export interface PageBody extends UpdatePageBody {
  pageState?: string;
}

export type UpdatePageBody = {
  title: string;
  slug: string;
  isHome: boolean;
  authenticatedOnly: boolean;
  authenticatedUserRole?: string;
  parentPageId?: string;
  hasNavigation: boolean;
  queryStrings?: any;
  copyFrom?: {
    id: string;
    type: AppTypes;
  };
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
