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
  Group,
  Header,
  Select,
} from "@mantine/core";
import Link from "next/link";

import { AIChatHistoryButton } from "@/components/AIChatHistoryButton";
import { ChangeHistoryPopover } from "@/components/ChangeHistoryPopover";
import { DeployButton } from "@/components/DeployButton";
import { EditorPreviewModeToggle } from "@/components/EditorPreviewModeToggle";
import { GenerateAIButton } from "@/components/GenerateAIButton";
import { LogicFlowButton } from "@/components/logic-flow/LogicFlowButton";
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
import { ErrorBoundary } from "react-error-boundary";

const ToggleNavbarButton = () => {
  const isNavBarVisible = useEditorStore((state) => state.isNavBarVisible);
  const setIsNavBarVisible = useEditorStore(
    (state) => state.setIsNavBarVisible,
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
  const { resetTree, isPreviewMode, setPreviewMode, language, setLanguage } =
    useEditorStore((state) => state);
  const { undo, redo, pastStates, futureStates } = useTemporalStore(
    (state) => state,
  );

  const router = useRouter();
  const projectId = router.query.id as string;
  const currentPageId = router.query.page as string;

  const pageResponse = useQuery<PageListResponse, Error>({
    queryKey: ["pages"],
    queryFn: () => getPageList(projectId),
  });

  return (
    <AppShell
      fixed
      padding={0}
      header={
        <Header height={HEADER_HEIGHT} sx={{ zIndex: 110 }}>
          <Group h={HEADER_HEIGHT} px="lg" align="center" position="apart">
            <Group>
              <Link href="/">
                <Logo />
              </Link>
              <ToggleNavbarButton />
            </Group>

            <Group noWrap position="right">
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
              <AIChatHistoryButton projectId={projectId} />
              <GenerateAIButton projectId={projectId} />
              <LogicFlowButton projectId={projectId} pageId={currentPageId} />
              <Button.Group>
                <Button
                  leftIcon={<IconArrowBackUp size={ICON_SIZE} />}
                  variant="default"
                  onClick={() => undo()}
                  disabled={pastStates.length < 2}
                />
                <Button
                  leftIcon={<IconArrowForwardUp size={ICON_SIZE} />}
                  variant="default"
                  onClick={() => redo()}
                  disabled={futureStates.length === 0}
                />
              </Button.Group>
              <ChangeHistoryPopover />
              <EditorPreviewModeToggle
                isPreviewMode={isPreviewMode}
                setPreviewMode={setPreviewMode}
              />
              <DeployButton
                projectId={projectId}
                page={pageResponse.data?.results?.find(
                  (p) => p.id === currentPageId,
                )}
              />
            </Group>
          </Group>
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
    </AppShell>
  );
};
