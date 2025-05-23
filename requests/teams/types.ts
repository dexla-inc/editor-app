import { PagingParams } from "@/requests/types";
import { TeamStatus, UserRoles } from "@/types/dashboardTypes";

export type TeamResponse = {
  id: string;
  projectId?: string | undefined;
  companyId?: string | undefined;
  usersName: string;
  email?: string | undefined;
  accessLevel: UserRoles;
  status: TeamStatus;
};

export type UserResponse = {
  email: string;
  firstName: string;
  lastName: string;
  pictureUrl: string;
  createdAt: number;
  lastCreatedAt: number;
  emailConfirmed: boolean;
  enabled: boolean;
  accessLevel: UserRoles;
  canInvite: boolean;
  canChangeRoles: boolean;
  canRemoveUsers: boolean;
};

export type TeamListResponse = {
  results: TeamResponse[];
};

export interface TeamParams extends PagingParams {
  projectId?: string;
  companyId?: string;
  status?: TeamStatus;
}

export type InviteTeamParams = {
  projectId?: string;
  companyId?: string;
  email: string;
  accessLevel: UserRoles;
};

export type AcceptInviteParams = {
  id: string;
  status: Extract<TeamStatus, "ACCEPTED" | "REJECTED">;
};
