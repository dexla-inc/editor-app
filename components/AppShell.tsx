import DashboardNavbar from "@/components/DashboardNavbar";
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
  Button,
  Flex,
  Header,
  LoadingOverlay,
  Select,
} from "@mantine/core";
import { User } from "@propelauth/react";
import Link from "next/link";

import { AIChatHistoryButton } from "@/components/AIChatHistoryButton";
import { EditorPreviewModeToggle } from "@/components/EditorPreviewModeToggle";
import { GenerateAIButton } from "@/components/GenerateAIButton";
import { SavingDisplay } from "@/components/SavingDisplay";
import { getPageList } from "@/requests/pages/queries";
import { PageListResponse } from "@/requests/pages/types";
import { useEditorStore, useTemporalStore } from "@/stores/editor";
import { IconArrowBackUp, IconArrowForwardUp } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

export interface ShellProps extends AppShellProps {
  navbarType?: NavbarTypes;
  user?: User | null | undefined;
}

export const Shell = ({
  children,
  navbar,
  aside,
  navbarType,
  user,
}: ShellProps) => {
  // This state needs to move to the parent component
  const [isLoading, setIsLoading] = useState(false);
  const resetTree = useEditorStore((state) => state.resetTree);
  const isSaving = useEditorStore((state) => state.isSaving);
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);
  const setPreviewMode = useEditorStore((state) => state.setPreviewMode);
  const { undo, redo, pastStates, futureStates } = useTemporalStore(
    (state) => state
  );
  const router = useRouter();
  const projectId = router.query.id as string;
  const currentPageId = router.query.page as string;

  const pageResponse = useQuery<PageListResponse, Error>({
    queryKey: ["pages"],
    queryFn: () => getPageList(projectId),
  });

  const pages =
    (pageResponse.data?.results?.map((r) => ({
      value: r.id,
      label: r.title,
    })) as ReadonlyArray<any>) || [];

  const goToEditor = (pageId: string) => {
    router.push(`/projects/${projectId}/editor/${pageId}`);
  };

  return (
    <AppShell
      fixed
      padding={0}
      header={
        <Header height={HEADER_HEIGHT}>
          <Flex h={HEADER_HEIGHT} px="lg" align="center">
            <Flex sx={{ width: "33%" }}>
              <Link href="/">
                <Logo />
              </Link>
            </Flex>
            {navbarType === "editor" && (
              <>
                <Select
                  label="Page"
                  value={currentPageId}
                  onChange={(value) => goToEditor(value as string)}
                  data={pages}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                    width: "33.33%",
                  }}
                />
                <Flex gap="md" sx={{ width: "33.33%" }} justify="end">
                  <AIChatHistoryButton projectId={projectId} />
                  <GenerateAIButton projectId={projectId} />
                  <Button.Group>
                    <Button
                      leftIcon={<IconArrowBackUp size={ICON_SIZE} />}
                      variant="default"
                      onClick={() => undo()}
                      disabled={pastStates.length < 2}
                    >
                      Undo
                    </Button>
                    <Button
                      leftIcon={<IconArrowForwardUp size={ICON_SIZE} />}
                      variant="default"
                      onClick={() => redo()}
                      disabled={futureStates.length === 0}
                    >
                      Redo
                    </Button>
                  </Button.Group>
                  <SavingDisplay isSaving={isSaving} />{" "}
                  <EditorPreviewModeToggle
                    isPreviewMode={isPreviewMode}
                    setPreviewMode={setPreviewMode}
                  />
                </Flex>
              </>
            )}
          </Flex>
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
