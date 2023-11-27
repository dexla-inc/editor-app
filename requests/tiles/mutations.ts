import { TileParams, TileResponse } from "@/requests/tiles/types";
import { SuccessResponse } from "@/requests/types";
import { del, post } from "@/utils/api";

export const upsertTile = async (
  companyId: string,
  templateId: string,
  params: TileParams,
) => {
  const url = `/templates/${templateId}/tiles?companyId=${companyId}`;

  const response = (await post<TileResponse>(url, params)) as TileResponse;

  return response;
};

export const deleteTile = async (
  companyId: string,
  templateId: string,
  id: string,
) => {
  const url = `/templates/${templateId}/tiles/${id}?companyId=${companyId}`;

  const response = (await del<SuccessResponse>(url)) as SuccessResponse;

  return response;
};
