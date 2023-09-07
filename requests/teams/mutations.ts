import { InviteTeamParams, TeamResponse } from "@/requests/teams/types";
import { post } from "@/utils/api";

export const inviteTeam = async (params: InviteTeamParams) => {
  const response = (await post<TeamResponse>(
    `/teams/invite`,
    params
  )) as TeamResponse;

  return response;
};
