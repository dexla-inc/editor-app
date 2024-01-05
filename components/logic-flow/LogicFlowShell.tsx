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
import { VariablesButton } from "@/components/variables/VariablesButton";
import { LogicFlowResponse } from "@/requests/logicflows/types";
import { useEditorStore } from "@/stores/editor";
import { useFlowStore } from "@/stores/flow";
import { DEFAULT_TEXTCOLOR, LOGICFLOW_BACKGROUND } from "@/utils/branding";
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
      // fixed
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
              {/*<Link href="/projects">*/}
              {/*  <Logo />*/}
              {/*</Link>*/}
              {flow && (
                <Breadcrumbs>
                  <Anchor
                    size="sm"
                    color={DEFAULT_TEXTCOLOR}
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
              <Button onClick={() => setShowFormModal(true)} compact>
                Create Logic Flow
              </Button>
              <VariablesButton pageId={pageId!} projectId={projectId!} />
              {/*<Button*/}
              {/*  component={Link}*/}
              {/*  variant="default"*/}
              {/*  href={`/projects/${projectId}/editor/${pageId}`}*/}
              {/*  compact*/}
              {/*>*/}
              {/*  Back to Editor*/}
              {/*</Button>*/}
            </Group>
          </Flex>
        </Header>
      }
      aside={aside}
      navbar={navbar}
      styles={{
        main: {
          backgroundColor: LOGICFLOW_BACKGROUND,
          minHeight: "60vh",
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: 0,
        },
      }}
    >
      <ErrorBoundary
        FallbackComponent={() => (
          <Box
            // w={`calc(100vw - ${ASIDE_WIDTH}px - ${NAVBAR_WIDTH}px)`}
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
