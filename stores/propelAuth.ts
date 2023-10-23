import { OrgMemberInfo, User } from "@propelauth/react";
import { UseAuthInfoProps } from "@propelauth/react/dist/types/useAuthInfo";
import { create } from "zustand";

type AuthState = {
  isAuthenticated: boolean;
  isDexlaAdmin: () => boolean;
  user: User;
  organisations?: OrgMemberInfo[];
  role?: any;
  logout: (redirectOnLogout: boolean) => Promise<void>;
  initializeAuth: (
    authInfo: UseAuthInfoProps,
    logoutFunction: (redirectOnLogout: boolean) => Promise<void>,
  ) => void;
};

export const usePropelAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: {} as User,
  organisations: [],
  isDexlaAdmin: () => false,
  logout: async (redirectOnLogout: boolean) => {},
  // Update functions
  initializeAuth: (authInfo, logoutFunction) => {
    set({
      user: authInfo.user || ({} as User),
      organisations: authInfo.orgHelper?.getOrgs(),
      isAuthenticated: !!authInfo.user,
      isDexlaAdmin: () => {
        const org =
          authInfo.orgHelper?.getOrgByName("Dexla") || ({} as OrgMemberInfo);
        return org.userAssignedRole === "DEXLA_ADMIN";
      },
      logout: logoutFunction,
    });
  },
}));
