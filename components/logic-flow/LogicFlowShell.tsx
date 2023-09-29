import { Logo } from "@/components/Logo";

import { ASIDE_WIDTH, HEADER_HEIGHT, NAVBAR_WIDTH } from "@/utils/config";
import { NavbarTypes } from "@/utils/dashboardTypes";
import {
  AppShell,
  AppShellProps,
  Box,
  Button,
  Flex,
  Group,
  Header,
} from "@mantine/core";
import Link from "next/link";

import { useEditorStore } from "@/stores/editor";
import { ErrorBoundary } from "react-error-boundary";
import { useFlowStore } from "@/stores/flow";
import { LogicFlowFormModal } from "@/components/logic-flow/LogicFlowFormModal";

export interface ShellProps extends AppShellProps {
  navbarType?: NavbarTypes;
}

export const LogicFlowShell = ({ children, aside }: ShellProps) => {
  const projectId = useEditorStore((state) => state.currentProjectId);
  const pageId = useEditorStore((state) => state.currentPageId);
  const resetTree = useEditorStore((state) => state.resetTree);
  const setShowFormModal = useFlowStore((state) => state.setShowFormModal);

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
            <Link href="/">
              <Logo />
            </Link>
            <Group>
              <Button onClick={() => setShowFormModal(true)}>
                Create logic flow
              </Button>
              <Button
                component={Link}
                variant="default"
                href={`/projects/${projectId}/editor/${pageId}`}
              >
                Go back to Editor
              </Button>
            </Group>
          </Flex>
        </Header>
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
      <LogicFlowFormModal />
    </AppShell>
  );
};
