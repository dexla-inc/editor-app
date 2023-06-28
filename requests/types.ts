export type PageParams = {
  search?: string;
  offset?: number;
  limit?: number;
};

export interface PagedResponse<T> {
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
