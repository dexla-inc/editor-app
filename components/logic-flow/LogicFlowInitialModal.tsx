import { LogicFlowCard } from "@/components/logic-flow/LogicFlowCard";
import { LogicFlowShell } from "@/components/logic-flow/LogicFlowShell";
import { listLogicFlows } from "@/requests/logicflows/queries-noauth";
import { LogicFlowResponse } from "@/requests/logicflows/types";
import { useEditorStore } from "@/stores/editor";
import { useFlowStore } from "@/stores/flow";
import { LOGICFLOW_BACKGROUND } from "@/utils/branding";
import { Box, Button, Group, Stack, Tabs, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
import { ContextModalProps } from "@mantine/modals";
import { LogicFlowsPage } from "@/components/logic-flow/LogicFlowsPage";
import { ReactFlowProvider } from "reactflow";

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

export default function LogicFlowInitialModal({}: ContextModalProps) {
  const setShowFormModal = useFlowStore((state) => state.setShowFormModal);
  const resetFlow = useFlowStore((state) => state.resetFlow);
  const projectId = useEditorStore((state) => state.currentProjectId ?? "");
  const selectedTabView = useFlowStore((state) => state.selectedTabView);
  const setSelectedTabView = useFlowStore((state) => state.setSelectedTabView);
  const setIsRestored = useFlowStore((state) => state.setIsRestored);

  const { data, isLoading } = useQuery({
    queryKey: ["logic-flows", projectId],
    queryFn: async () => {
      const response = await listLogicFlows(projectId);
      return response.results ?? [];
    },
    enabled: !!projectId,
  });

  const logicFlows = (data ?? []) as LogicFlowResponse[];

  useEffect(() => {
    if (projectId) {
      resetFlow();
    }
  }, [projectId, resetFlow]);

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
                  onEdit={() => {
                    setShowFormModal(true, flow.id);
                  }}
                  onClick={() => {
                    setSelectedTabView("flow");
                    setFlowId(flow.id);
                    setIsRestored(false);
                  }}
                />
              );
            })}
          </Group>
        </LogicFlowShell>
      </Tabs.Panel>
      <Tabs.Panel value={"flow"}>
        <LogicFlowsPage flowId={flowId} />
      </Tabs.Panel>
    </Tabs>
  );
}
