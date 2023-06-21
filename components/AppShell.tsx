import DashboardNavbar from "@/components/DashboardNavbar";
import { Logo } from "@/components/Logo";
import { HEADER_HEIGHT } from "@/utils/config";
import {
  Anchor,
  AppShell,
  AppShellProps,
  Group,
  Header,
  LoadingOverlay,
} from "@mantine/core";
import { User } from "@propelauth/react";
import { useState } from "react";

export interface ShellProps extends AppShellProps {
  navbarType?: "editor" | "dashboard";
  user: User | null | undefined;
}

export const Shell = ({
  children,
  navbar,
  aside,
  navbarType,
  user,
}: ShellProps) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AppShell
      fixed
      padding={0}
      header={
        <Header height={HEADER_HEIGHT}>
          <Group h={HEADER_HEIGHT} pl="lg">
            <Anchor href="/">
              <Logo />
            </Anchor>
          </Group>
        </Header>
      }
      navbar={
        navbarType === "dashboard" ? (
          <DashboardNavbar setIsLoading={setIsLoading} user={user} />
        ) : (
          navbar
        )
      }
      aside={aside}
      styles={{
        main: {
          minHeight: "var(--vh, 100vh)",
          paddingLeft: "var(--mantine-navbar-width, 0px)",
        },
      }}
    >
      {children}
      <LoadingOverlay visible={isLoading} />
    </AppShell>
  );
};
