import { OrgMemberInfo, User, WithAuthInfoProps } from "@propelauth/react";
import { UseAuthInfoProps } from "@propelauth/react/dist/types/hooks/useAuthInfo";
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
  checkHasAccess: (authInfo: UseAuthInfoProps, projectId: string) => boolean;
  reset: () => void;
};

export const usePropelAuthStore = create<AuthState>()(
  persist(
    (set, get, store) => ({
      accessToken: "",
      user: {} as User,
      authInfo: {} as WithAuthInfoProps,
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
        const companies = authInfo?.orgHelper?.getOrgs() || [];
        const { activeCompanyId } = get();

        const activeCompany =
          companies.find((company) => company.orgId === activeCompanyId) ||
          companies[0];

        set({
          accessToken: authInfo?.accessToken || "",
          user: authInfo?.user || ({} as User),
          companies: companies,
          activeCompany,
          activeCompanyId: activeCompany?.orgId,
          isDexlaAdmin:
            activeCompany?.userAssignedRole?.includes("DEXLA_ADMIN") || false,
          userPermissions: activeCompany?.userPermissions || [],
        });
      },
      checkHasAccess: (authInfo: UseAuthInfoProps, projectId: string) => {
        const { activeCompanyId } = get();
        const companies = authInfo?.orgHelper?.getOrgs() || [];

        const activeCompany =
          companies.find((company) => company.orgId === activeCompanyId) ||
          companies[0];

        const allowedProjectIds = activeCompany.orgMetadata["projectIds"]
          ?.toString()
          .split(",");
        return allowedProjectIds?.includes(projectId);
      },
      reset: () => {
        store.persist.clearStorage();
        set({
          accessToken: "",
          user: {} as User,
          companies: [],
          isDexlaAdmin: false,
          activeCompanyId: "",
          activeCompany: {} as OrgMemberInfo,
          userPermissions: [],
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
