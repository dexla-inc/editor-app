import { useEditorStore } from "@/stores/editor";
import { createClient } from "@propelauth/javascript";
import { OrgMemberInfo, User } from "@propelauth/react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  accessToken: string;
  user: User;
  companies: OrgMemberInfo[];
  setActiveCompany: (companyId: string) => void;
  activeCompany: OrgMemberInfo;
  activeCompanyId: string;
  initializeAuth: () => Promise<void>;
  isDexlaAdmin: boolean;
  userPermissions: string[];
};

export const usePropelAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: "",
      user: {} as User,
      companies: [],
      isDexlaAdmin: false,
      activeCompanyId: "",
      activeCompany: {} as OrgMemberInfo,
      userPermissions: [],
      setActiveCompany: (companyId: string) => {
        const matchingCompany = get().companies.find(
          (company) => company.orgId === companyId,
        );
        if (matchingCompany) {
          set({ activeCompany: matchingCompany });
          set({ activeCompanyId: matchingCompany.orgId });
          set({ userPermissions: matchingCompany.userPermissions || [] });
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

          const companies = authInfo?.orgHelper.getOrgs() || [];
          const activeCompanyId = get().activeCompanyId;
          const activeCompany = activeCompanyId
            ? companies.find((company) => company.orgId === activeCompanyId) ||
              companies[0]
            : companies[0];

          set({
            accessToken: authInfo?.accessToken || "",
            user: authInfo?.user || ({} as User),
            companies: authInfo?.orgHelper.getOrgs() || [],
            activeCompany,
            activeCompanyId: activeCompanyId || activeCompany?.orgId || "",
            isDexlaAdmin:
              activeCompany.userAssignedRole?.includes("DEXLA_ADMIN") || false,
          });
        }
      },
    }),
    {
      name: "propelauth-storage",
      partialize: (state: AuthState) => ({
        activeCompanyId: state.activeCompanyId,
      }),
    },
  ),
);
