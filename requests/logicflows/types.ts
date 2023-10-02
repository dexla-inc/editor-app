import { PagingParams } from "@/requests/types";

export type LogicFlowParams = {
  name: string;
  data: string;
  isGlobal: boolean;
  pageId?: string;
};

export type LogicFlowPagingParams = PagingParams & {
  pageId?: string;
  isGlobal: boolean;
};

export type LogicFlowResponse = LogicFlowParams & {
  id: string;
};
