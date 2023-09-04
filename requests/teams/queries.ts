import {
  AcceptInviteParams,
  TeamListResponse,
  TeamParams,
  TeamResponse,
} from "@/requests/teams/types";
import { get } from "@/utils/api";
import { buildQueryString } from "@/utils/dashboardTypes";

export const getTeamsList = async (params?: TeamParams) => {
  let url = `/teams`;
  url += buildQueryString({ ...params });

  const response = (await get<TeamListResponse>(url, {})) as TeamListResponse;

  return response;
};

export const acceptInvite = async ({ id, status }: AcceptInviteParams) => {
  let url = `/teams/accept?id=${id}&status=${status}`;

  const response = (await get<TeamResponse>(url, {})) as TeamResponse;

  return response;
};
