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
  Header,
  Tooltip,
} from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorBoundary } from "react-error-boundary";
import { useEditorTreeStore } from "../stores/editorTree";
import PageSelector from "./PageSelector";

export const Shell = ({ children, navbar, aside }: AppShellProps) => {
  const router = useRouter();
  const projectId = router.query.id as string;
  const isDexlaAdmin = usePropelAuthStore((state) => state.isDexlaAdmin);

  return (
    <AppShell
      fixed
      padding={0}
      header={
        <Header height={HEADER_HEIGHT} sx={{ zIndex: 110 }}>
          <Group h={HEADER_HEIGHT} px="xs" align="center" position="apart">
            <DashboardRedirector projectId={projectId} />
            <Group noWrap position="right" spacing="xs">
              {/* <LanguageSelector /> */}
              <PageSelector />
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
