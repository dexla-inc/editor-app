export type PagingParams = {
  search?: string;
  offset?: number;
  limit?: number;
};

export interface PagingResponse<T> {
  results: Array<T>;
  paging: PagingModel;
  trackingId: string;
}

interface PagingModel {
  totalRecords: number;
  recordsPerPage: number;
  page: number;
}

export type MethodTypes = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type PatchParams = {
  op: string;
  path: string;
  value: any;
};

export type CreatedResponse = {
  id: string;
  trackingId: string;
};

export type SuccessResponse = Omit<CreatedResponse, "id">;
