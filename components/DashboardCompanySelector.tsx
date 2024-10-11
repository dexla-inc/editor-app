import { Menu, Stack } from "@mantine/core";

import DashboardCompanySelectorPopover from "@/components/DashboardCompanySelectorPopover";
import { usePropelAuthStore } from "@/stores/propelAuth";
import { usePathname } from "next/navigation";
import { useRouterWithLoader } from "@/hooks/useRouterWithLoader";

export const DashboardCompanySelector = () => {
  const companies = usePropelAuthStore((state) => state.companies);
  const activeCompany = usePropelAuthStore((state) => state.activeCompany);
  const setActiveCompany = usePropelAuthStore(
    (state) => state.setActiveCompany,
  );
  const router = useRouterWithLoader();
  const pathname = usePathname();

  const handleCompanyClick = (orgId: string) => {
    setActiveCompany(orgId);

    if (pathname !== "/projects") {
      router.push("/projects");
    }
  };

  return (
    <Menu withArrow>
      <Menu.Target>
        <DashboardCompanySelectorPopover
          company={activeCompany}
        ></DashboardCompanySelectorPopover>
      </Menu.Target>
      <Menu.Dropdown>
        <Stack w={200} spacing={0}>
          {companies?.map((company) => (
            <Menu.Item
              key={company.orgId}
              onClick={() => {
                handleCompanyClick(company.orgId);
              }}
            >
              {company.orgName}
            </Menu.Item>
          ))}
        </Stack>
      </Menu.Dropdown>
    </Menu>
  );
};
