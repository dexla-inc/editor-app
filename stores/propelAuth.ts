import { useEditorStore } from "@/stores/editor";
import { createClient } from "@propelauth/javascript";
import { OrgMemberInfo, User } from "@propelauth/react";
import { create } from "zustand";

type AuthState = {
  accessToken: string;
  user: User;
  companies: OrgMemberInfo[];
  logout: (redirectOnLogout: boolean) => Promise<void>;
  setActiveCompany: (companyId: string) => void;
  activeCompany: OrgMemberInfo;
  activeCompanyId: string;
  initializeAuth: () => Promise<void>;
  isDexlaAdmin: boolean;
};

export const usePropelAuthStore = create<AuthState>((set, get) => ({
  accessToken: "",
  user: {} as User,
  companies: [],
  activeCompanyId: "",
  isDexlaAdmin: false,
  activeCompany: {} as OrgMemberInfo,
  logout: async (redirectOnLogout: boolean) => {},
  setActiveCompany: (companyId: string) => {
    const matchingCompany = get().companies.find(
      (company) => company.orgId === companyId,
    );
    if (matchingCompany) {
      set({ activeCompany: matchingCompany });
      set({ activeCompanyId: matchingCompany.orgId });
    }
  },
  initializeAuth: async () => {
    const { isLive } = useEditorStore.getState();
    if (!isLive) {
      const authClient = createClient({
        authUrl: process.env.NEXT_PUBLIC_AUTH_URL as string,
        enableBackgroundTokenRefresh: true,
      });
      const authInfo = await authClient.getAuthenticationInfoOrNull();
      const logout = authClient.logout;

      const companies = authInfo?.orgHelper.getOrgs() || [];
      const activeCompany = companies[0];

      set({
        accessToken: authInfo?.accessToken || "",
        user: authInfo?.user || ({} as User),
        companies: authInfo?.orgHelper.getOrgs() || [],
        activeCompany,
        activeCompanyId: activeCompany?.orgId || "",
        logout: logout,
        isDexlaAdmin:
          activeCompany.userAssignedRole?.includes("DEXLA_ADMIN") || false,
      });
    }
  },
}));

// export const usePropelAuthStore = create<AuthState>((set, get): AuthState => {
//   const { isLive } = useEditorStore.getState();

//   const initializeAuthAsync = async () => {
//     if (!isLive) {
//       const authClient = createClient({
//         authUrl: process.env.NEXT_PUBLIC_AUTH_URL as string,
//         enableBackgroundTokenRefresh: true,
//       });
//       const authInfo = await authClient.getAuthenticationInfoOrNull();
//       const logout = authClient.logout;

//       const storedCompanyId = localStorage.getItem("activeCompanyId");
//       const companies = authInfo?.orgHelper.getOrgs() || [];
//       const activeCompany = storedCompanyId
//         ? companies.find((c) => c.orgId === storedCompanyId)
//         : companies[0];

//       set({
//         accessToken: authInfo?.accessToken || "",
//         user: authInfo?.user || ({} as User),
//         companies: authInfo?.orgHelper.getOrgs() || [],
//         activeCompany,
//         activeCompanyId: activeCompany?.orgId || "",
//         logout: logout,
//       });
//     }
//   };

//   // Automatically invoke the internalGetAuthInfo when the store is created
//   initializeAuthAsync();

//   return {
//     accessToken: "",
//     user: {} as User,
//     companies: [],
//     logout: async (redirectOnLogout: boolean) => {},
//     activeCompany: {} as OrgMemberInfo,
//     activeCompanyId: "",
//     initializeAuth: initializeAuthAsync,
//     isDexlaAdmin: false,
//     setActiveCompany: (companyId: string) => {
//       const matchingCompany = get().companies.find(
//         (company) => company.orgId === companyId,
//       );
//       if (matchingCompany) {
//         set({ activeCompany: matchingCompany });
//         set({ activeCompanyId: matchingCompany.orgId });
//       }
//     },
//   };
// });
