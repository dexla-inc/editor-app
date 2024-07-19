"use client";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Notifications } from "@mantine/notifications";
import { ContextMenuProvider } from "@/contexts/ContextMenuProvider";
import { ReactFlowProvider } from "reactflow";
import { ModalsProvider } from "@mantine/modals";
import LogicFlowInitialModal from "@/components/logic-flow/LogicFlowInitialModal";
import { ReactNode } from "react";
import InstantiatePropelAuthStore from "@/components/InstantiatePropelAuthStore";
import InitialisePropelAuth from "@/components/InitialisePropelAuth";
import QuickAccessModal from "@/components/editor/QuickAccessModal";
import { cache } from "@/utils/emotionCache";
import { MantineProvider } from "@mantine/core";
import { useUserConfigStore } from "@/stores/userConfig";
import { darkTheme, theme } from "@/utils/branding";
import { MantineGlobal } from "@/components/MantineGlobal";
import { VariableInstanceTracker } from "@/components/variables/VariableInstanceTracker";
export const EditorProviders = ({ children }: { children: ReactNode }) => {
  const isDarkTheme = useUserConfigStore((state: any) => state.isDarkTheme);

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={isDarkTheme ? darkTheme : theme}
      emotionCache={cache}
    >
      <InitialisePropelAuth>
        <InstantiatePropelAuthStore />
        <ReactQueryDevtools initialIsOpen={false} />
        <MantineGlobal isLive={false} />
        <Notifications />
        <ContextMenuProvider>
          <ReactFlowProvider>
            <ModalsProvider
              modals={{
                logicFlows: LogicFlowInitialModal,
                quickAccess: QuickAccessModal,
                variableInstanceTracker: VariableInstanceTracker,
              }}
            >
              {children}
            </ModalsProvider>
          </ReactFlowProvider>
        </ContextMenuProvider>
      </InitialisePropelAuth>
    </MantineProvider>
  );
};
