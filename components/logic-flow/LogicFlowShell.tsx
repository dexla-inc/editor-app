import { Logo } from "@/components/Logo";

import { ASIDE_WIDTH, HEADER_HEIGHT, NAVBAR_WIDTH } from "@/utils/config";
import {
  Anchor,
  AppShell,
  AppShellProps,
  Box,
  Breadcrumbs,
  Button,
  Flex,
  Group,
  Header,
  Text,
} from "@mantine/core";
import Link from "next/link";

import { LogicFlowFormModal } from "@/components/logic-flow/LogicFlowFormModal";
import { LogicFlowResponse } from "@/requests/logicflows/types";
import { useEditorStore } from "@/stores/editor";
import { useFlowStore } from "@/stores/flow";
import { ErrorBoundary } from "react-error-boundary";

export interface ShellProps extends AppShellProps {
  flow?: LogicFlowResponse;
}

export const LogicFlowShell = ({
  children,
  navbar,
  aside,
  flow,
}: ShellProps) => {
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
            <Group>
              <Link href="/">
                <Logo />
              </Link>
              {flow && (
                <Breadcrumbs>
                  <Anchor
                    size="sm"
                    color="dark"
                    component={Link}
                    href={`/projects/${projectId}/editor/${pageId}/flows`}
                  >
                    Logic Flows
                  </Anchor>
                  <Text size="xs" color="dimmed">
                    {flow.name}
                  </Text>
                </Breadcrumbs>
              )}
            </Group>
            <Group>
              <Button onClick={() => setShowFormModal(true)}>
                Create Logic Flow
              </Button>
              <Button
                component={Link}
                variant="default"
                href={`/projects/${projectId}/editor/${pageId}`}
              >
                Back to Editor
              </Button>
            </Group>
          </Flex>
        </Header>
      }
      aside={aside}
      navbar={navbar}
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
