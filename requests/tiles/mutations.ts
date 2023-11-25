import { TileParams, TileResponse } from "@/requests/tiles/types";
import { SuccessResponse } from "@/requests/types";
import { del, post, put } from "@/utils/api";

export const createTile = async (companyId: string, params: TileParams) => {
  const url = `/templates?companyId=${companyId}`;

  const response = (await post<TileResponse>(url, params)) as TileResponse;

  return response;
};

export const updateTile = async (
  companyId: string,
  id: string,
  params: TileParams,
) => {
  const url = `/templates/${id}?companyId=${companyId}`;

  const response = (await put<TileResponse>(url, params)) as TileResponse;

  return response;
};

export const deleteTile = async (companyId: string, id: string) => {
  const url = `/templates/${id}?companyId=${companyId}`;

  const response = (await del<SuccessResponse>(url)) as SuccessResponse;

  return response;
};
