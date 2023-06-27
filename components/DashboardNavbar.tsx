import NavigationAvatarFooter from "@/components/NavigationAvatarFooter";
import { useAppStore } from "@/stores/app";
import { HEADER_HEIGHT, ICON_SIZE, NAVBAR_WIDTH } from "@/utils/config";
import { NavbarTypes } from "@/utils/dashboardTypes";
import { Box, Button, Menu, NavLink, Navbar, ScrollArea } from "@mantine/core";
import { User, useLogoutFunction } from "@propelauth/react";
import {
  IconArrowLeft,
  IconDatabase,
  IconLogout,
  IconSettings,
} from "@tabler/icons-react";
import { useRouter } from "next/router";

type DashboardNavbarProps = {
  isLoading?: boolean;
  setIsLoading: (isLoading: boolean) => void;
  user: User | null | undefined;
  navbarType: NavbarTypes;
};

export default function DashboardNavbar({
  setIsLoading,
  user,
  navbarType,
}: DashboardNavbarProps) {
  const logout = useLogoutFunction();
  const startLoading = useAppStore((state) => state.startLoading);
  const router = useRouter();
  const projectId = router.query.id as string;

  return (
    <Navbar
      width={{ base: NAVBAR_WIDTH }}
      sx={{
        height: `calc(100% - ${HEADER_HEIGHT}px)`,
      }}
    >
      <Navbar.Section grow component={ScrollArea}>
        <Box py="sm">
          {navbarType === "project" && (
            <>
              <Button
                onClick={() => router.push(`/projects`)}
                variant="default"
                m="sm"
                leftIcon={<IconArrowLeft size={ICON_SIZE} stroke={1.5} />}
              >
                Back
              </Button>

              <NavLink
                label="Settings"
                childrenOffset={10}
                defaultOpened
                style={{ fontWeight: "600" }}
              >
                <NavLink
                  label="General"
                  onClick={() => router.push(`/projects/${projectId}/settings`)}
                  icon={<IconSettings size={ICON_SIZE} />}
                  variant="subtle"
                  active={router.pathname === "/projects/[id]/settings"}
                  py={12}
                />
                <NavLink
                  label="Data Sources"
                  onClick={() =>
                    router.push(`/projects/${projectId}/settings/datasources`)
                  }
                  variant="subtle"
                  icon={<IconDatabase size={ICON_SIZE} />}
                  active={router.pathname.startsWith(
                    "/projects/[id]/settings/datasources"
                  )}
                  py={12}
                />
              </NavLink>
            </>
          )}
        </Box>
      </Navbar.Section>
      <Navbar.Section>
        <Menu width={250} withArrow>
          <Menu.Target>
            <NavigationAvatarFooter user={user} />
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Account</Menu.Label>
            <Menu.Item icon={<IconSettings size={ICON_SIZE} />} disabled>
              Settings
            </Menu.Item>
            <Menu.Item
              icon={<IconLogout size={ICON_SIZE} />}
              color="red"
              onClick={() => {
                setIsLoading(true);
                logout(true);
              }}
            >
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Navbar.Section>
    </Navbar>
  );
}
