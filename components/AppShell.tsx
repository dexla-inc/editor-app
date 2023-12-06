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
  Tooltip,
} from "@mantine/core";
import Link from "next/link";

import { AIChatHistoryButton } from "@/components/AIChatHistoryButton";
import AIPromptTextInput from "@/components/AIPromptTextInput";
import { ActionIconDefault } from "@/components/ActionIconDefault";
import { AddGridButton } from "@/components/AddGridButton";
import { ChangeHistoryPopover } from "@/components/ChangeHistoryPopover";
import { DeployButton } from "@/components/DeployButton";
import { EditorPreviewModeToggle } from "@/components/EditorPreviewModeToggle";
import { FileStorageButton } from "@/components/FileStorageButton";
import { Icon } from "@/components/Icon";
import { SaveTemplateButton } from "@/components/SaveTemplateButton";
import { VariablesButton } from "@/components/variables/VariablesButton";
import { getPageList } from "@/requests/pages/queries";
import { PageListResponse } from "@/requests/pages/types";
import { useEditorStore } from "@/stores/editor";
import { usePropelAuthStore } from "@/stores/propelAuth";
import { flexStyles } from "@/utils/branding";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { ErrorBoundary } from "react-error-boundary";

export const Shell = ({ children, navbar, aside }: AppShellProps) => {
  const resetTree = useEditorStore((state) => state.resetTree);
  const setIsWindowError = useEditorStore((state) => state.setIsWindowError);
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);
  const setPreviewMode = useEditorStore((state) => state.setPreviewMode);
  const language = useEditorStore((state) => state.language);
  const setLanguage = useEditorStore((state) => state.setLanguage);

  const router = useRouter();
  const projectId = router.query.id as string;
  const currentPageId = router.query.page as string;

  const pageResponse = useQuery<PageListResponse, Error>({
    queryKey: ["pages"],
    queryFn: () => getPageList(projectId),
  });

  const isDexlaAdmin = usePropelAuthStore((state) => state.isDexlaAdmin);

  return (
    <AppShell
      fixed
      padding={0}
      header={
        <Header height={HEADER_HEIGHT} sx={{ zIndex: 110 }}>
          <Group h={HEADER_HEIGHT} px="xs" align="center" position="apart">
            <Group>
              <Tooltip label="Back to dashboard" fz="xs">
                <Link href="/projects">
                  <Logo />
                </Link>
              </Tooltip>
              <AIPromptTextInput />
            </Group>
            <Group noWrap position="right" spacing="xs">
              <Select
                label="Language"
                value={language}
                onChange={setLanguage}
                size="xs"
                data={[
                  { value: "default", label: "English" },
                  { value: "french", label: "French" },
                ]}
                sx={{
                  ...flexStyles,
                  whiteSpace: "nowrap",
                  width: "160px",
                }}
                display="none"
              />
              {isDexlaAdmin && <AddGridButton />}
              {isDexlaAdmin && <SaveTemplateButton />}
              {isDexlaAdmin && <AIChatHistoryButton projectId={projectId} />}
              <ActionIconDefault
                iconName="IconGitBranch"
                tooltip="Logic Flows"
                href={`/projects/${projectId}/editor/${currentPageId}/flows`}
              />
              <VariablesButton projectId={projectId} pageId={currentPageId} />
              <FileStorageButton />
              <ChangeHistoryPopover />
              <EditorPreviewModeToggle
                isPreviewMode={isPreviewMode}
                setPreviewMode={setPreviewMode}
              />
              <Button
                component={Link}
                href={`/projects/${projectId}/settings/team`}
                leftIcon={<Icon name="IconUserPlus" size={ICON_SIZE} />}
                compact
                variant="default"
                target="_blank"
              >
                Invite
              </Button>
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
          setIsWindowError(true);
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
