import { OrgMemberInfo, User, useLogoutFunction } from "@propelauth/react";
import {
  UseAuthInfoProps,
  useAuthInfo,
} from "@propelauth/react/dist/types/useAuthInfo";
import { temporal } from "zundo";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type AuthState = {
  isAuthenticated: boolean;
  isDexlaAdmin: () => boolean;
  user: User;
  organisations?: OrgMemberInfo[];
  role?: any;
  logout: (redirectOnLogout: boolean) => Promise<void>;
  initializeAuth?: (
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

export const usePropelAuth = create<AuthState>()(
  devtools(
    temporal((set) => {
      // This runs once when the store is initialized
      if (typeof window !== "undefined") {
        // Ensuring we're on the client side

        const authInfo = useAuthInfo();
        const logoutFunction = useLogoutFunction();

        set({
          user: authInfo.user || ({} as User),
          organisations: authInfo.orgHelper?.getOrgs(),
          isAuthenticated: !!authInfo.user,
          isDexlaAdmin: () => {
            const org =
              authInfo.orgHelper?.getOrgByName("Dexla") ||
              ({} as OrgMemberInfo);
            return org.userAssignedRole === "DEXLA_ADMIN";
          },
          logout: logoutFunction,
        });
      }

      return {
        isAuthenticated: false,
        user: {} as User,
        organisations: [],
        isDexlaAdmin: () => false,
        logout: async (redirectOnLogout: boolean) => {},
      };
    }),
  ),
);
