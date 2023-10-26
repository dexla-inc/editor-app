import {
  AcceptInviteParams,
  TeamResponse,
  UserResponse,
} from "@/requests/teams/types";
import { PagingResponse } from "@/requests/types";
import { get } from "@/utils/api";

export const getTeamsList = async (companyId: string) => {
  let url = `/teams/${companyId}`;

  const response = (await get<PagingResponse<UserResponse>>(
    url,
    {},
  )) as PagingResponse<UserResponse>;

  return response;
};

export const acceptInvite = async ({ id, status }: AcceptInviteParams) => {
  let url = `/teams/accept?id=${id}&status=${status}`;

  const response = (await get<TeamResponse>(url, {})) as TeamResponse;

  return response;
};
