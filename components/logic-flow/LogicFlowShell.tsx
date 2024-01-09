import { HEADER_HEIGHT } from "@/utils/config";
import { AppShell, AppShellProps, Box } from "@mantine/core";

import { LogicFlowFormModal } from "@/components/logic-flow/LogicFlowFormModal";
import { LogicFlowResponse } from "@/requests/logicflows/types";
import { useEditorStore } from "@/stores/editor";
import { LOGICFLOW_BACKGROUND } from "@/utils/branding";
import { ErrorBoundary } from "react-error-boundary";

export interface ShellProps extends AppShellProps {
  flow?: LogicFlowResponse;
}

export const LogicFlowShell = ({
  children,
  navbar,
  aside,
  header,
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
