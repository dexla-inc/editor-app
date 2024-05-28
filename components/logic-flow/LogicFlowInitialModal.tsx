import { LogicFlowCard } from "@/components/logic-flow/LogicFlowCard";
import { LogicFlowShell } from "@/components/logic-flow/LogicFlowShell";
import { LogicFlowsPage } from "@/components/logic-flow/LogicFlowsPage";
import { useFlowsQuery } from "@/hooks/editor/reactQuery/useFlowsQuery";
import { LogicFlowResponse } from "@/requests/logicflows/types";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useFlowStore } from "@/stores/flow";
import { LOGICFLOW_BACKGROUND } from "@/utils/branding";
import {
  Box,
  Button,
  Group,
  Stack,
  Tabs,
  Text,
  TextInput,
} from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { ContextModalProps } from "@mantine/modals";
import { IconSearch } from "@tabler/icons-react";
import { GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";

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
  const projectId = useEditorTreeStore(
    (state) => state.currentProjectId,
  ) as string;
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
  const [forceRenderId, setForceRenderId] = useState<string>("");
  const [filter, setFilter] = useDebouncedState("", 100);
  const [filteredFlows, setFilteredFlows] = useState<LogicFlowResponse[]>([]);

  // Update filtered flows whenever the filter or the original list changes
  useEffect(() => {
    if (logicFlows?.results) {
      const lowerCaseFilter = filter.toLowerCase();
      const filtered = logicFlows.results.filter((flow) =>
        flow.name.toLowerCase().includes(lowerCaseFilter),
      );
      setFilteredFlows(filtered);
    }
  }, [filter, logicFlows]);

  return (
    <Tabs value={selectedTabView} onTabChange={setSelectedTabView}>
      <Tabs.Panel value={"list"}>
        <LogicFlowShell sx={{ padding: "20px" }}>
          {logicFlows?.results.length === 0 && !isLoading && (
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
          <TextInput
            placeholder="Search"
            mb="xs"
            maw={600}
            icon={<IconSearch size={14} />}
            defaultValue={filter}
            onChange={(event) => {
              setFilter(event.currentTarget.value);
            }}
          />
          <Group>
            {filteredFlows.map((flow: LogicFlowResponse) => {
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
                    setForceRenderId(nanoid());
                    setIsRestored(false);
                  }}
                />
              );
            })}
          </Group>
        </LogicFlowShell>
      </Tabs.Panel>
      <Tabs.Panel value={"flow"}>
        {flow && <LogicFlowsPage flow={flow} forceRenderId={forceRenderId} />}
      </Tabs.Panel>
    </Tabs>
  );
}
