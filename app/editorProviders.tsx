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
export const EditorProviders = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <InitialisePropelAuth>
        <InstantiatePropelAuthStore />
        <ReactQueryDevtools initialIsOpen={false} />
        <Notifications />
        <ContextMenuProvider>
          <ReactFlowProvider>
            <ModalsProvider modals={{ logicFlows: LogicFlowInitialModal }}>
              {children}
            </ModalsProvider>
          </ReactFlowProvider>
        </ContextMenuProvider>
      </InitialisePropelAuth>
    </>
  );
};
