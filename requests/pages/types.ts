import { PagingParams } from "@/requests/types";
import { AppTypes } from "@/utils/dashboardTypes";

export type PageAIResponse = {
  name: string;
  features: string[];
};

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

export type QueryStringListItem = { key: string; value: string };

export type UpdatePageBody = {
  title: string;
  slug: string;
  isHome: boolean;
  authenticatedOnly: boolean;
  authenticatedUserRole?: string;
  description?: string;
  parentPageId?: string;
  hasNavigation: boolean;
  queryStrings?: Record<string, string>;
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
