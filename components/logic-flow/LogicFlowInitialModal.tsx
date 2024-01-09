import { LogicFlowCard } from "@/components/logic-flow/LogicFlowCard";
import { LogicFlowShell } from "@/components/logic-flow/LogicFlowShell";
import {
  createLogicFlow,
  deleteLogicFlow,
} from "@/requests/logicflows/mutations";
import { listLogicFlows } from "@/requests/logicflows/queries-noauth";
import { LogicFlowResponse } from "@/requests/logicflows/types";
import { useEditorStore } from "@/stores/editor";
import { useFlowStore } from "@/stores/flow";
import { LOGICFLOW_BACKGROUND } from "@/utils/branding";
import { ASIDE_WIDTH, HEADER_HEIGHT } from "@/utils/config";
import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Group,
  Modal,
  Stack,
  Tabs,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
import { useEditor } from "@tiptap/react";
import { ContextModalProps, modals } from "@mantine/modals";
import { LogicFlowsPage } from "@/components/logic-flow/LogicFlowsPage";
import { ReactFlowProvider } from "reactflow";
import { IconArrowBack } from "@tabler/icons-react";
import { VariablesButton } from "@/components/variables/VariablesButton";

export const getServerSideProps = async ({
  query,
}: GetServerSidePropsContext) => {
  return {
    props: {
      id: query.id,
      page: query.page,
    },
  };
};

type Props = {
  // id: string;
  // page: string;
  opened: boolean;
  onClose: () => void;
};

export default function LogicFlowInitialModal({
  context,
  id,
  innerProps,
}: ContextModalProps<any>) {
  const theme = useMantineTheme();
  const setCurrentProjectId = useEditorStore(
    (state) => state.setCurrentProjectId,
  );
  const setCurrentPageId = useEditorStore((state) => state.setCurrentPageId);
  const setShowFormModal = useFlowStore((state) => state.setShowFormModal);
  const resetFlow = useFlowStore((state) => state.resetFlow);
  const page = useEditorStore((state) => state.currentPageId ?? "");
  const projectId = useEditorStore((state) => state.currentProjectId ?? "");
  const selectedTabView = useFlowStore((state) => state.selectedTabView);
  const setSelectedTabView = useFlowStore((state) => state.setSelectedTabView);

  const client = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["logic-flows", projectId, page],
    queryFn: async () => {
      const response = await listLogicFlows(projectId, { pageId: page });
      return response.results ?? [];
    },
    enabled: !!projectId && !!page,
  });

  const duplicateFlow = useMutation({
    mutationKey: ["logic-flow"],
    mutationFn: async (values: any) => {
      return createLogicFlow(projectId as string, values);
    },
    onSettled: async () => {
      await client.refetchQueries(["logic-flows", projectId, page]);
    },
  });

  const deleteFlow = useMutation({
    mutationKey: ["logic-flow"],
    mutationFn: async (flowId: string) => {
      return await deleteLogicFlow(projectId, flowId);
    },
    onSettled: async () => {
      await client.refetchQueries(["logic-flows", projectId, page]);
    },
  });

  const logicFlows = (data ?? []) as LogicFlowResponse[];

  useEffect(() => {
    if (projectId && page) {
      setCurrentProjectId(projectId);
      setCurrentPageId(page);
      resetFlow();
    }
  }, [projectId, page, setCurrentPageId, setCurrentProjectId, resetFlow]);

  const [flowId, setFlowId] = useState<string>("");

  return (
    <Tabs value={selectedTabView} onTabChange={setSelectedTabView}>
      <Tabs.Panel value={"list"}>
        <LogicFlowShell>
          {logicFlows?.length === 0 && !isLoading && (
            <Box
              w="100%"
              h="100%"
              sx={{
                display: "flex",
                justifyContent: "Center",
                alignItems: "center",
                backgroundColor: LOGICFLOW_BACKGROUND,
              }}
            >
              <Stack>
                <Text> No logic flows found</Text>
                <Button onClick={() => setShowFormModal(true)}>Create</Button>
              </Stack>
            </Box>
          )}
          <Group sx={{ padding: "20px" }}>
            {logicFlows?.map((flow: LogicFlowResponse) => {
              return (
                <LogicFlowCard
                  key={flow.id}
                  flow={flow}
                  isLoading={deleteFlow.isLoading || duplicateFlow.isLoading}
                  onDelete={async () => {
                    await deleteFlow.mutate(flow.id);
                  }}
                  onEdit={() => {
                    setShowFormModal(true, flow.id);
                  }}
                  onDuplicate={async () => {
                    await duplicateFlow.mutate({
                      name: flow.name!,
                      data: flow.data,
                      pageId: flow.pageId,
                      isGlobal: flow.isGlobal ?? false,
                    });
                  }}
                  onClick={() => {
                    setSelectedTabView("flow");
                    setFlowId(flow.id);
                  }}
                />
              );
            })}
          </Group>
        </LogicFlowShell>
      </Tabs.Panel>
      <Tabs.Panel value={"flow"}>
        <ReactFlowProvider>
          <LogicFlowsPage flowId={flowId} />
        </ReactFlowProvider>
      </Tabs.Panel>
    </Tabs>
  );
}
