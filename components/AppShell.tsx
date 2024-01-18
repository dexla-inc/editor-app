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
import { ChangeThemeButton } from "@/components/ChangeThemeButton";
import { DeployButton } from "@/components/DeployButton";
import { EditorPreviewModeToggle } from "@/components/EditorPreviewModeToggle";
import { Icon } from "@/components/Icon";
import { OtherAvatars } from "@/components/OtherAvatars";
import { SaveTemplateButton } from "@/components/SaveTemplateButton";
import { VariablesButton } from "@/components/variables/VariablesButton";
import { useLogicFlows } from "@/hooks/logic-flow/useLogicFlows";
import { usePageListQuery } from "@/hooks/reactQuery/usePageListQuery";
import { useEditorStore, useTemporalStore } from "@/stores/editor";
import { usePropelAuthStore } from "@/stores/propelAuth";
import { flexStyles } from "@/utils/branding";
import { useRouter } from "next/router";
import { ErrorBoundary } from "react-error-boundary";

export const Shell = ({ children, navbar, aside }: AppShellProps) => {
  const resetTree = useEditorStore((state) => state.resetTree);
  const setIsWindowError = useEditorStore((state) => state.setIsWindowError);

  const language = useEditorStore((state) => state.language);
  const setLanguage = useEditorStore((state) => state.setLanguage);
  const setPages = useEditorStore((state) => state.setPages);

  const router = useRouter();
  const projectId = router.query.id as string;
  const currentPageId = router.query.page as string;

  const { data: pageListQuery } = usePageListQuery(projectId);

  setPages(pageListQuery?.results ?? []);

  const isDexlaAdmin = usePropelAuthStore((state) => state.isDexlaAdmin);
  const clear = useTemporalStore((state) => state.clear);
  const { openLogicFlowsModal } = useLogicFlows();

  return (
    <AppShell
      fixed
      padding={0}
      header={
        <Header height={HEADER_HEIGHT} sx={{ zIndex: 110 }}>
          <Group h={HEADER_HEIGHT} px="xs" align="center" position="apart">
            <Group>
              <Tooltip withinPortal label="Back to dashboard" fz="xs">
                <Link onClick={() => clear()} href="/projects">
                  <Logo />
                </Link>
              </Tooltip>
              <AIPromptTextInput />
              <OtherAvatars />
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
                onClick={openLogicFlowsModal}
              />
              <VariablesButton projectId={projectId} />
              <ChangeHistoryPopover />
              <EditorPreviewModeToggle />
              <Tooltip label="Invite team">
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
              </Tooltip>
              <DeployButton
                projectId={projectId}
                page={pageListQuery?.results?.find(
                  (p) => p.id === currentPageId,
                )}
              />
              <ChangeThemeButton />
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
