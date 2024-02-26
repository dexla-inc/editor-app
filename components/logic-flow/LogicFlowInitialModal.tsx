import { LogicFlowCard } from "@/components/logic-flow/LogicFlowCard";
import { LogicFlowShell } from "@/components/logic-flow/LogicFlowShell";
import { LogicFlowsPage } from "@/components/logic-flow/LogicFlowsPage";
import { useFlowsQuery } from "@/hooks/reactQuery/useFlowsQuery";
import { LogicFlowResponse } from "@/requests/logicflows/types";
import { useEditorStore } from "@/stores/editor";
import { useFlowStore } from "@/stores/flow";
import { LOGICFLOW_BACKGROUND } from "@/utils/branding";
import { Box, Button, Group, Stack, Tabs, Text } from "@mantine/core";
import { ContextModalProps } from "@mantine/modals";
import { GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";

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
  const projectId = useEditorStore((state) => state.currentProjectId) as string;
  const selectedTabView = useFlowStore((state) => state.selectedTabView);
  const setSelectedTabView = useFlowStore((state) => state.setSelectedTabView);
  const setIsRestored = useFlowStore((state) => state.setIsRestored);

  const { data: logicFlows, isLoading } = useFlowsQuery(projectId);

  useEffect(() => {
    if (projectId) {
      resetFlow();
    }
  }, [projectId, resetFlow]);

  const [flow, setFlow] = useState<LogicFlowResponse>();

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
                    setShowFormModal(true, flow);
                  }}
                  onClick={() => {
                    setSelectedTabView("flow");
                    setFlow(flow);
                    setIsRestored(false);
                  }}
                />
              );
            })}
          </Group>
        </LogicFlowShell>
      </Tabs.Panel>
      <Tabs.Panel value={"flow"}>
        {flow && <LogicFlowsPage flow={flow} />}
      </Tabs.Panel>
    </Tabs>
  );
}
