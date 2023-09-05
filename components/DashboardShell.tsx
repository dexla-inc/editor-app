import { Logo } from "@/components/Logo";

import {
  ASIDE_WIDTH,
  HEADER_HEIGHT,
  ICON_SIZE,
  NAVBAR_WIDTH,
} from "@/utils/config";
import { NavbarTypes } from "@/utils/dashboardTypes";
import {
  AppShell,
  AppShellProps,
  Box,
  Flex,
  Header,
  LoadingOverlay,
  Menu,
} from "@mantine/core";
import { User } from "@propelauth/react";
import Link from "next/link";

import { Icon } from "@/components/Icon";
import NavigationAvatarFooter from "@/components/NavigationAvatarFooter";
import { useEditorStore } from "@/stores/editor";
import { useLogoutFunction } from "@propelauth/react";
import {
  IconLayoutNavbarCollapse,
  IconLayoutNavbarExpand,
} from "@tabler/icons-react";
import { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

export interface ShellProps extends AppShellProps {
  navbarType?: NavbarTypes;
  user?: User | null | undefined;
}

const ToggleNavbarButton = () => {
  const isNavBarVisible = useEditorStore((state) => state.isNavBarVisible);
  const setIsNavBarVisible = useEditorStore(
    (state) => state.setIsNavBarVisible
  );
  const IconToggle = isNavBarVisible
    ? IconLayoutNavbarCollapse
    : IconLayoutNavbarExpand;

  return (
    <IconToggle
      onClick={setIsNavBarVisible}
      style={{ transform: "rotate(-90deg)", cursor: "pointer" }}
    />
  );
};

export const DashboardShell = ({ children, aside, user }: ShellProps) => {
  // This state needs to move to the parent component
  const [isLoading, setIsLoading] = useState(false);
  const resetTree = useEditorStore((state) => state.resetTree);
  const logout = useLogoutFunction();

  return (
    <AppShell
      fixed
      padding={0}
      header={
        <Header height={HEADER_HEIGHT} sx={{ zIndex: 110 }}>
          <Flex
            h={HEADER_HEIGHT}
            px="lg"
            align="center"
            justify="space-between"
          >
            <Link href="/">
              <Logo />
            </Link>
            <Flex>
              <Menu withArrow>
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
                  <Menu.Item
                    icon={<Icon name="IconSettings" size={ICON_SIZE} />}
                    disabled
                  >
                    Settings
                  </Menu.Item>
                  <Menu.Item
                    icon={<Icon name="IconLogout" size={ICON_SIZE} />}
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
            </Flex>
          </Flex>
        </Header>
      }
      aside={aside}
      styles={{
        main: {
          minHeight: "100vh",
          paddingLeft: "var(--mantine-navbar-width, 0px)",
        },
      }}
    >
      <ErrorBoundary
        FallbackComponent={() => (
          <Box
            w={`calc(100vw - ${ASIDE_WIDTH}px - ${NAVBAR_WIDTH}px)`}
            h={`calc(100vh - ${HEADER_HEIGHT}px)`}
            sx={{
              display: "flex",
              justifyContent: "Center",
              alignItems: "center",
            }}
          >
            Something went wrong
          </Box>
        )}
        onError={(error, info) => {
          console.error("Error:", error);
          console.error("Info:", info);
        }}
        onReset={() => {
          resetTree();
        }}
      >
        {children}
      </ErrorBoundary>
      <LoadingOverlay visible={isLoading} />
    </AppShell>
  );
};
