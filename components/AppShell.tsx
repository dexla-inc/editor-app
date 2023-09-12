import { Logo } from "@/components/Logo";

import {
  ASIDE_WIDTH,
  HEADER_HEIGHT,
  ICON_SIZE,
  NAVBAR_WIDTH,
} from "@/utils/config";
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
import Link from "next/link";

import { AIChatHistoryButton } from "@/components/AIChatHistoryButton";
import { ChangeHistoryPopover } from "@/components/ChangeHistoryPopover";
import { EditorPreviewModeToggle } from "@/components/EditorPreviewModeToggle";
import { GenerateAIButton } from "@/components/GenerateAIButton";
import { getPageList } from "@/requests/pages/queries";
import { PageListResponse } from "@/requests/pages/types";
import { useEditorStore, useTemporalStore } from "@/stores/editor";
import {
  IconArrowBackUp,
  IconArrowForwardUp,
  IconLayoutNavbarCollapse,
  IconLayoutNavbarExpand,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

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

export const Shell = ({ children, navbar, aside }: AppShellProps) => {
  // This state needs to move to the parent component
  const [isLoading, setIsLoading] = useState(false);
  const { resetTree, isPreviewMode, setPreviewMode, language, setLanguage } =
    useEditorStore((state) => state);
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
        <Header height={HEADER_HEIGHT} sx={{ zIndex: 110 }}>
          <Flex h={HEADER_HEIGHT} px="lg" align="center">
            <Flex sx={{ width: "33%" }} align="center" gap={10}>
              <Link href="/">
                <Logo />
              </Link>
              <ToggleNavbarButton />
            </Flex>
            <>
              <Flex gap={20}>
                <Select
                  label="Page"
                  value={currentPageId}
                  onChange={goToEditor}
                  data={pages}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                    whiteSpace: "nowrap",
                  }}
                />
                <Select
                  label="Language"
                  value={language}
                  onChange={setLanguage}
                  data={[
                    { value: "default", label: "English" },
                    { value: "french", label: "French" },
                  ]}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                    width: "33.33%",
                    whiteSpace: "nowrap",
                  }}
                />
              </Flex>

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
                <ChangeHistoryPopover />{" "}
                <EditorPreviewModeToggle
                  isPreviewMode={isPreviewMode}
                  setPreviewMode={setPreviewMode}
                />
              </Flex>
            </>
          </Flex>
        </Header>
      }
      navbar={navbar}
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
