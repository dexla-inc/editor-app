import { IResponse, PagingParams } from "@/requests/types";
import { Action } from "@/utils/actions";
import { AppTypes } from "@/types/dashboardTypes";

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

export type PageStateParams = {
  state: string;
  description: string;
  pageLoadTimestamp: number;
};

export type PageStateResponse = PageStateParams & {
  id: string;
  created: number;
};

export type QueryStringListItem = { key: string; value: string };

export type PageBody = {
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
  actions?: Action[];
  features?: string[];
};

export type PageConfigProps = {
  title: string;
  description: string;
  slug: string;
  authenticatedOnly: boolean;
};

export type PageActionProps = {
  name?: string;
  actions?: Action[];
};

export type PagesResponse = IResponse & {
  homePageId: string;
  [key: string]: any;
};

export interface PageParams extends PagingParams {
  search?: string;
  isHome?: boolean;
  slug?: string;
}

export type PageStateHistoryResponse = {
  id: string;
  created: number;
  description: string;
};
