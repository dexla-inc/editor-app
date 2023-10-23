import { AuthenticationInfo, createClient } from "@propelauth/javascript";
import { OrgMemberInfo, User } from "@propelauth/react";
import { create } from "zustand";

type AuthState = {
  authInfo: AuthenticationInfo | null;
  isAuthenticated: boolean;
  isDexlaAdmin: boolean;
  user: User;
  organisations?: OrgMemberInfo[];
  role?: string;
  logout: (redirectOnLogout: boolean) => Promise<void>;
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
