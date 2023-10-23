import { AuthenticationInfo, createClient } from "@propelauth/javascript";
import {
  OrgMemberInfo,
  RedirectToLogin,
  RequiredAuthProvider,
  RequiredAuthProviderProps,
  User,
} from "@propelauth/react";
import { UseAuthInfoProps } from "@propelauth/react/dist/types/useAuthInfo";
import { RedirectToLoginProps } from "@propelauth/react/dist/types/useRedirectFunctions";
import { create } from "zustand";

type AuthState = {
  authInfo: AuthenticationInfo | null;
  isAuthenticated: boolean;
  isDexlaAdmin: boolean;
  user: User;
  organisations?: OrgMemberInfo[];
  role?: string;
  logout: (redirectOnLogout: boolean) => Promise<void>;
  RedirectToLogin: (props: RedirectToLoginProps) => JSX.Element;
  RequiredAuthProvider: (props: RequiredAuthProviderProps) => JSX.Element;
};

const getAuthInfo = async () => {
  const authClient = createClient({
    authUrl: process.env.NEXT_PUBLIC_AUTH_URL as string,
    enableBackgroundTokenRefresh: true,
  });
  const authInfo = await authClient.getAuthenticationInfoOrNull();
  const logout = authClient.logout;
  return { authInfo, logout };
};

export const usePropelAuthStore = create<AuthState>((set, get) => ({
  authInfo: null,
  isAuthenticated: false,
  user: {} as User,
  organisations: [],
  isDexlaAdmin: false,
  role: "",
  logout: async (redirectOnLogout: boolean) => {},
  RedirectToLogin: RedirectToLogin,
  RequiredAuthProvider: RequiredAuthProvider,
}));

// initializing store
const initStore = async () => {
  const { authInfo, logout } = await getAuthInfo();
  usePropelAuthStore.setState({
    authInfo,
    user: authInfo?.user || ({} as User),
    organisations: authInfo?.orgHelper.getOrgs() || [],
    isAuthenticated: !!authInfo?.user,
    logout: logout,
    isDexlaAdmin:
      authInfo?.orgHelper.getOrgByName("dexla")?.userAssignedRole ===
      "DEXLA-ADMIN",
    role: authInfo?.orgHelper.getOrgByName("dexla")?.userAssignedRole,
  });
};

initStore();
