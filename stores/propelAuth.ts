import { OrgMemberInfo, User, WithAuthInfoProps } from "@propelauth/react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  accessToken: string;
  user: User;
  companies: OrgMemberInfo[];
  isDexlaAdmin: boolean;
  activeCompanyId: string;
  activeCompany: OrgMemberInfo;
  userPermissions: string[];
  setActiveCompany: (companyId: string) => void;
  initializeAuth: (authInfo: WithAuthInfoProps) => Promise<void>;
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
          set({
            isDexlaAdmin:
              matchingCompany.userAssignedRole?.includes("DEXLA_ADMIN") ||
              false,
          });
        }
      },
      initializeAuth: async (authInfo: WithAuthInfoProps) => {
        // const authClient = createClient({
        //   authUrl: process.env.NEXT_PUBLIC_AUTH_URL as string,
        //   enableBackgroundTokenRefresh: true,
        // });

        //const authInfo = await authClient.getAuthenticationInfoOrNull();

        const companies = authInfo?.orgHelper?.getOrgs() || [];
        const activeCompanyId = get().activeCompanyId;
        const activeCompany = activeCompanyId
          ? companies.find((company) => company.orgId === activeCompanyId)
          : companies[0];

        set({
          accessToken: authInfo?.accessToken || "",
          user: authInfo?.user || ({} as User),
          companies: companies,
          activeCompany,
          activeCompanyId: activeCompanyId || activeCompany?.orgId || "",
          isDexlaAdmin:
            activeCompany?.userAssignedRole?.includes("DEXLA_ADMIN") || false,
        });
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
