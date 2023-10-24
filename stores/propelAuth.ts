import { AuthenticationInfo, createClient } from "@propelauth/javascript";
import {
  OrgMemberInfo,
  RedirectToLogin,
  RequiredAuthProvider,
  RequiredAuthProviderProps,
  User,
} from "@propelauth/react";
import { RedirectToLoginProps } from "@propelauth/react/dist/types/useRedirectFunctions";
import { create } from "zustand";

type AuthState = {
  authInfo: AuthenticationInfo | null;
  isDexlaAdmin: boolean;
  user: User;
  organisations?: OrgMemberInfo[];
  role?: string;
  logout: (redirectOnLogout: boolean) => Promise<void>;
  RequiredAuthProvider: (props: RequiredAuthProviderProps) => JSX.Element;
  RedirectToLogin: (props: RedirectToLoginProps) => JSX.Element;
  initializeAuth: () => Promise<void>;
};

export const usePropelAuthStore = create<AuthState>((set) => {
  const internalGetAuthInfo = async () => {
    const authClient = createClient({
      authUrl: process.env.NEXT_PUBLIC_AUTH_URL as string,
      enableBackgroundTokenRefresh: true,
    });
    const authInfo = await authClient.getAuthenticationInfoOrNull();
    const logout = authClient.logout;
    set({
      authInfo,

      user: authInfo?.user || ({} as User),
      organisations: authInfo?.orgHelper.getOrgs() || [],
      logout: logout,
      isDexlaAdmin:
        authInfo?.orgHelper.getOrgByName("Dexla")?.userAssignedRole ===
        "DEXLA_ADMIN",
      role: authInfo?.orgHelper.getOrgs()[0]?.userAssignedRole, // To change when we support multiple organizations
    });
  };

  // Automatically invoke the internalGetAuthInfo when the store is created
  internalGetAuthInfo();

  return {
    authInfo: null,
    user: {} as User,
    organisations: [],
    isDexlaAdmin: false,
    role: "",
    logout: async (redirectOnLogout: boolean) => {},
    RequiredAuthProvider: RequiredAuthProvider,
    RedirectToLogin: RedirectToLogin,
    initializeAuth: internalGetAuthInfo,
  };
});
