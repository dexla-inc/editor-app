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
  header,
  flow,
}: ShellProps) => {
  const resetTree = useEditorStore((state) => state.resetTree);

  return (
    <AppShell
      padding={0}
      aside={aside}
      navbar={navbar}
      header={header}
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
