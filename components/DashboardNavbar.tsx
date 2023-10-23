import { Icon } from "@/components/Icon";
import NavigationAvatarFooter from "@/components/NavigationAvatarFooter";
import { usePropelAuthStore } from "@/stores/propelAuth";
import { HEADER_HEIGHT, ICON_SIZE, NAVBAR_WIDTH } from "@/utils/config";
import { NavbarTypes } from "@/utils/dashboardTypes";
import { Box, Button, Menu, NavLink, Navbar, ScrollArea } from "@mantine/core";
import { IconArrowLeft, IconLogout, IconSettings } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/router";

type DashboardNavbarProps = {
  isLoading?: boolean;
  setIsLoading: (isLoading: boolean) => void;

  navbarType: NavbarTypes;
};

export default function DashboardNavbar({
  setIsLoading,
  navbarType,
}: DashboardNavbarProps) {
  const logout = usePropelAuthStore((state) => state.logout);
  const router = useRouter();
  const projectId = router.query.id as string;
  const user = usePropelAuthStore((state) => state.user);

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
                component={Link}
                href="/projects"
                variant="subtle"
                leftIcon={<IconArrowLeft size={ICON_SIZE} stroke={1.5} />}
                sx={{ margin: 10 }}
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
                  component={Link}
                  href={`/projects/${projectId}/settings`}
                  icon={<Icon name="IconSettings" size={ICON_SIZE} />}
                  variant="subtle"
                  active={router.pathname === "/projects/[id]/settings"}
                  py={12}
                />
                <NavLink
                  label="Data Sources"
                  component={Link}
                  href={`/projects/${projectId}/settings/datasources`}
                  variant="subtle"
                  icon={<Icon name="IconDatabase" size={ICON_SIZE} />}
                  active={router.pathname.startsWith(
                    "/projects/[id]/settings/datasources",
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
            <NavigationAvatarFooter
              firstName={user?.firstName}
              lastName={user?.lastName}
              email={user?.email}
              pictureUrl={user?.pictureUrl}
            />
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
