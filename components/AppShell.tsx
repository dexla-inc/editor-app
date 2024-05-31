import { AIChatHistoryButton } from "@/components/AIChatHistoryButton";
import { AddGridButton } from "@/components/AddGridButton";
import { ChangeHistoryPopover } from "@/components/ChangeHistoryPopover";
import { ChangeThemeButton } from "@/components/ChangeThemeButton";
import { DeployButton } from "@/components/DeployButton";
import { EditorPreviewModeToggle } from "@/components/EditorPreviewModeToggle";
import { Icon } from "@/components/Icon";
import { SaveTemplateButton } from "@/components/SaveTemplateButton";
import DashboardRedirector from "@/components/editor/DashboardRedirector";
import OpenLogicFlowsButton from "@/components/editor/OpenLogicFlowsButton";
import { VariablesButton } from "@/components/variables/VariablesButton";
import { useEditorStore } from "@/stores/editor";
import { usePropelAuthStore } from "@/stores/propelAuth";
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
  Header as MantineHeader,
  Tooltip,
} from "@mantine/core";
import Link from "next/link";
import { ErrorBoundary } from "react-error-boundary";
import { useEditorTreeStore } from "../stores/editorTree";
import PageSelector from "./PageSelector";
import { Navbar } from "@/components/navbar/Navbar";
import { Aside } from "@/components/aside/Aside";
import { memo } from "react";
import QuickAccessButton from "@/components/editor/QuickAccessButton";

const HeaderComponent = ({ projectId }: { projectId: string }) => {
  const isDexlaAdmin = usePropelAuthStore((state) => state.isDexlaAdmin);

  return (
    <MantineHeader height={HEADER_HEIGHT} sx={{ zIndex: 110 }}>
      <Group h={HEADER_HEIGHT} px="xs" align="center" position="apart">
        <DashboardRedirector projectId={projectId} />
        <Group noWrap position="right" spacing="xs">
          {/* <LanguageSelector /> */}
          <PageSelector />
          <QuickAccessButton id="quick-access-button" projectId={projectId} />
          {isDexlaAdmin && <AddGridButton />}
          {isDexlaAdmin && <SaveTemplateButton />}
          {isDexlaAdmin && <AIChatHistoryButton projectId={projectId} />}
          <OpenLogicFlowsButton />
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
          <DeployButton />
          <ChangeThemeButton />
        </Group>
      </Group>
    </MantineHeader>
  );
};

const Header = memo(HeaderComponent);

export const ShellComponent = ({
  children,
  projectId,
}: AppShellProps & { projectId: string }) => {
  return (
    <AppShell
      fixed
      padding={0}
      header={<Header projectId={projectId} />}
      navbar={<Navbar />}
      aside={<Aside />}
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
          const setIsWindowError = useEditorStore.getState().setIsWindowError;
          setIsWindowError(true);
        }}
        onReset={() => {
          const resetTree = useEditorTreeStore.getState().resetTree;
          resetTree();
        }}
      >
        {children}
      </ErrorBoundary>
    </AppShell>
  );
};

export const Shell = memo(ShellComponent);
