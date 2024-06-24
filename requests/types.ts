export type PagingParams = {
  search?: string;
  offset?: number;
  limit?: number;
};

export interface IResponse {
  trackingId?: string; // This is a unique identifier for the request
}

export interface PagingResponse<T> extends IResponse {
  results: Array<T>;
  paging: PagingModel;
}

export interface PagingModel {
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

export type CreatedResponse = IResponse & {
  id: string;
};

export type SuccessResponse = Omit<CreatedResponse, "id">;
