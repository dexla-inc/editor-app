import DashboardNavbar from "@/components/DashboardNavbar";
import { Logo } from "@/components/Logo";

import { HEADER_HEIGHT } from "@/utils/config";
import { NavbarTypes } from "@/utils/dashboardTypes";
import {
  AppShell,
  AppShellProps,
  Flex,
  Group,
  Header,
  LoadingOverlay,
} from "@mantine/core";
import { User } from "@propelauth/react";
import Link from "next/link";

import { EditorPreviewModeToggle } from "@/components/EditorPreviewModeToggle";
import { SavingDisplay } from "@/components/SavingDisplay";
import { useEditorStore } from "@/stores/editor";
import { useState } from "react";

export interface ShellProps extends AppShellProps {
  navbarType?: NavbarTypes;
  user?: User | null | undefined;
}

export const Shell = ({
  children,
  navbar,
  aside,
  navbarType = "editor",
  user,
}: ShellProps) => {
  // This state needs to move to the parent component
  const [isLoading, setIsLoading] = useState(false);
  const isSaving = useEditorStore((state) => state.isSaving);
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);
  const togglePreviewMode = useEditorStore((state) => state.togglePreviewMode);

  return (
    <AppShell
      fixed
      padding={0}
      header={
        <Header height={HEADER_HEIGHT}>
          <Group h={HEADER_HEIGHT} px="lg" position="apart">
            <Link href="/">
              <Logo />
            </Link>
            {navbarType === "editor" && (
              <Flex gap="md">
                <SavingDisplay isSaving={isSaving} />{" "}
                <EditorPreviewModeToggle
                  isPreviewMode={isPreviewMode}
                  togglePreviewMode={togglePreviewMode}
                />
              </Flex>
            )}
          </Group>
        </Header>
      }
      navbar={
        navbarType === "company" || navbarType === "project" ? (
          <DashboardNavbar
            setIsLoading={setIsLoading}
            user={user}
            navbarType={navbarType}
          />
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
