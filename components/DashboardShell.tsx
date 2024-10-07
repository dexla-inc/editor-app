"use client";

import { Logo } from "@/components/Logo";

import { ASIDE_WIDTH, HEADER_HEIGHT, NAVBAR_WIDTH } from "@/utils/config";
import { NavbarTypes } from "@/types/dashboardTypes";
import {
  AppShell,
  AppShellProps,
  Box,
  Flex,
  Header,
  Navbar,
} from "@mantine/core";
import LoadingOverlay from "@/components/LoadingOverlay";

import Link from "next/link";

import { DashboardCompanySelector } from "@/components/DashboardCompanySelector";
import { DashboardNavLinks } from "@/components/DashboardNavLinks";
import { DashboardUserMenu } from "@/components/DashboardUserMenu";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ChangeThemeButton } from "./ChangeThemeButton";

export interface ShellProps extends AppShellProps {
  navbarType?: NavbarTypes;
}

export const DashboardShell = ({ children, aside }: ShellProps) => {
  // This state needs to move to the parent component
  const [isLoading, setIsLoading] = useState(false);
  const resetTree = useEditorTreeStore((state) => state.resetTree);

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
            <Link href="/projects">
              <Logo />
            </Link>
            <ChangeThemeButton />
          </Flex>
        </Header>
      }
      navbar={
        <Navbar height="auto" width={{ base: 240 }}>
          <Navbar.Section>
            <DashboardCompanySelector></DashboardCompanySelector>
          </Navbar.Section>
          <Navbar.Section grow mt="md">
            <DashboardNavLinks></DashboardNavLinks>
          </Navbar.Section>
          <Navbar.Section>
            <DashboardUserMenu></DashboardUserMenu>
          </Navbar.Section>
        </Navbar>
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
