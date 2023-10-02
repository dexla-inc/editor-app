import { LogicFlowCard } from "@/components/logic-flow/LogicFlowCard";
import { LogicFlowShell } from "@/components/logic-flow/LogicFlowShell";
import { useEditorStore } from "@/stores/editor";
import { useFlowStore } from "@/stores/flow";
import { ASIDE_WIDTH, HEADER_HEIGHT } from "@/utils/config";
import {
  Box,
  Button,
  Group,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { LogicFlow } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetServerSidePropsContext } from "next";
import { useEffect } from "react";

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
  id: string;
  page: string;
};

export default function LogicFlowsPage({ id, page }: Props) {
  const theme = useMantineTheme();
  const setCurrentProjectId = useEditorStore(
    (state) => state.setCurrentProjectId,
  );
  const setCurrentPageId = useEditorStore((state) => state.setCurrentPageId);
  const selectedFlowNode = useFlowStore((state) => state.selectedNode);
  const setShowFormModal = useFlowStore((state) => state.setShowFormModal);
  const resetFlow = useFlowStore((state) => state.resetFlow);

  const client = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["logic-flows", id, page],
    queryFn: async () => {
      const response = await fetch(
        `/api/logic-flows?projectId=${id}&pageId=${page}`,
      );
      const json = await response.json();
      return json ?? [];
    },
    enabled: !!id && !!page,
  });

  const duplicateFlow = useMutation({
    mutationKey: ["logic-flow"],
    mutationFn: async (values: any) => {
      return await fetch(`/api/logic-flows/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
    },
    onSettled: async () => {
      await client.refetchQueries(["logic-flows", id, page]);
    },
  });

  const deleteFlow = useMutation({
    mutationKey: ["logic-flow"],
    mutationFn: async (id: string) => {
      return await fetch(`/api/logic-flows/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
    },
    onSettled: async () => {
      await client.refetchQueries(["logic-flows", id, page]);
    },
  });

  const logicFlows = (data ?? []) as LogicFlow[];

  useEffect(() => {
    if (id && page) {
      setCurrentProjectId(id);
      setCurrentPageId(page);
      resetFlow();
    }
  }, [id, page, setCurrentPageId, setCurrentProjectId, resetFlow]);

  return (
    <LogicFlowShell>
      <Box
        style={{
          width: `calc(100vw - ${selectedFlowNode ? ASIDE_WIDTH : 0}px)`,
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          backgroundColor: theme.colors.gray[0],
        }}
        p="xl"
      >
        {logicFlows?.length === 0 && !isLoading && (
          <Box
            w="100%"
            h="100%"
            sx={{
              display: "flex",
              justifyContent: "Center",
              alignItems: "center",
            }}
          >
            <Stack>
              <Text> No logic flows found</Text>
              <Button onClick={() => setShowFormModal(true)}>Create</Button>
            </Stack>
          </Box>
        )}
        <Group>
          {logicFlows?.map((flow: LogicFlow) => {
            return (
              <LogicFlowCard
                key={flow.id}
                flow={flow}
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
                    projectId: flow.projectId,
                    pageId: flow.pageId,
                    isGlobal: flow.isGlobal ?? false,
                  });
                }}
              />
            );
          })}
        </Group>
      </Box>
    </LogicFlowShell>
  );
}
