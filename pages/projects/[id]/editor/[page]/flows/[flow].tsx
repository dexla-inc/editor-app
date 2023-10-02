import { FlowNode } from "@/components/logic-flow/FlowNode";
import { LogicFlow } from "@/components/logic-flow/LogicFlow";
import { LogicFlowShell } from "@/components/logic-flow/LogicFlowShell";
import { useEditorStore } from "@/stores/editor";
import { FlowData, useFlowStore } from "@/stores/flow";
import { decodeSchema, encodeSchema } from "@/utils/compression";
import { ASIDE_WIDTH, HEADER_HEIGHT, NAVBAR_WIDTH } from "@/utils/config";
import { matchQuery } from "@/utils/filter";
import { PossibleNodes, nodes, nodesData } from "@/utils/logicFlows";
import { prisma } from "@/utils/prisma";
import { removeKeysRecursive } from "@/utils/removeKeys";
import {
  Aside,
  Box,
  Center,
  Navbar,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedState, usePrevious } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import {
  QueryClient,
  dehydrate,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import isEqual from "lodash.isequal";
import startCase from "lodash.startcase";
import { GetServerSidePropsContext } from "next";
import { useCallback, useEffect, useRef } from "react";
import { useUpdateNodeInternals } from "reactflow";

export const getServerSideProps = async ({
  query,
}: GetServerSidePropsContext) => {
  const queryClient = new QueryClient();
  const flowId = query.flow as string;

  await queryClient.prefetchQuery(["logic-flow", flowId], async () => {
    return await prisma.logicFlow.findFirst({
      where: { id: flowId as string },
    });
  });

  return {
    props: JSON.parse(
      JSON.stringify({
        id: query.id,
        pageId: query.page,
        flowId,
        dehydratedState: dehydrate(queryClient),
      }),
    ),
  };
};

type Props = {
  id: string;
  pageId: string;
  flowId: string;
};

export default function LogicFlowsPage({ id, pageId, flowId }: Props) {
  const theme = useMantineTheme();
  const reactFlowWrapper = useRef(null);
  const [filter, setFilter] = useDebouncedState("", 250);
  const setCurrentProjectId = useEditorStore(
    (state) => state.setCurrentProjectId,
  );
  const setCurrentPageId = useEditorStore((state) => state.setCurrentPageId);
  const restoreFlow = useFlowStore((state) => state.restoreFlow);
  const selectedNode = useFlowStore((state) => state.selectedNode);
  const isRestored = useFlowStore((state) => state.isRestored);
  const isDragging = useFlowStore((state) => state.isDragging);
  const setIsUpdating = useFlowStore((state) => state.setIsUpdating);
  const updateNodeData = useFlowStore((state) => state.updateNodeData);
  const state = useFlowStore((state) => ({
    nodes: state.nodes,
    edges: state.edges,
  }));
  const updateNodeInternals = useUpdateNodeInternals();
  const previousSelectedNode = usePrevious(selectedNode);

  const { data: flow } = useQuery({
    queryKey: ["logic-flow", id, pageId],
    queryFn: async () => {
      const response = await fetch(`/api/logic-flows/${flowId}`);
      const json = await response.json();
      return json;
    },
    enabled: !!flowId,
  });

  const { mutate: updateFlow } = useMutation({
    mutationKey: ["logic-flow", flow?.id],
    mutationFn: async ({ values }: any) => {
      setIsUpdating(true);
      const response = await fetch(`/api/logic-flows/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: encodeSchema(JSON.stringify(values.data)),
          id: flow?.id,
        }),
      });
      setIsUpdating(false);

      return response;
    },
  });

  useEffect(() => {
    if (id && pageId) {
      setCurrentProjectId(id);
      setCurrentPageId(pageId);
    }
  }, [id, pageId, setCurrentPageId, setCurrentProjectId]);

  useEffect(() => {
    if (flow?.data) {
      const data = JSON.parse(decodeSchema(flow.data as string));
      restoreFlow(data as any);
    }
  }, [flow?.data, restoreFlow]);

  const filterNodes = () => {
    return Object.keys(nodes).filter((key) => {
      const data = nodesData[key as keyof typeof nodesData].data;
      return (
        matchQuery(filter, data.label) || matchQuery(filter, data.description)
      );
    });
  };

  const hasChanges = useCallback(() => {
    const flowData = flow?.data as unknown as FlowData;
    const nodes = state.nodes.map((n) =>
      removeKeysRecursive(n, ["width", "height"]),
    ) as FlowData["nodes"];
    const edges = state.edges;
    const equal =
      isEqual(nodes, flowData.nodes) && isEqual(edges, flowData.edges);

    return !equal;
  }, [flow?.data, state.edges, state.nodes]);

  useEffect(() => {
    if (isRestored && !isDragging && hasChanges()) {
      const nodes = state.nodes.map((n) =>
        removeKeysRecursive(n, ["width", "height"]),
      ) as FlowData["nodes"];
      const edges = state.edges;

      updateFlow({
        id,
        values: { data: { nodes, edges } },
      });
    }
  }, [
    isDragging,
    isRestored,
    hasChanges,
    state.nodes,
    state.edges,
    updateFlow,
    id,
  ]);

  const form = useForm({
    initialValues: {
      label: selectedNode?.data.label ?? "",
    },
  });

  useEffect(() => {
    if (selectedNode && previousSelectedNode?.id !== selectedNode?.id) {
      form.setValues({
        ...selectedNode.data.form,
        label: selectedNode.data.label,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNode, previousSelectedNode]);

  const onSubmit = async ({ label, ...values }: any) => {
    const isConditionalNode = selectedNode?.type === "conditionalNode";
    updateNodeData({
      id: selectedNode?.id,
      data: {
        label,
        form: values,
        ...(isConditionalNode ? { outputs: values.outputs } : {}),
      },
    });
    updateNodeInternals(selectedNode?.id!);
  };

  const nodeData = nodesData[selectedNode?.type as keyof typeof nodesData];
  const NodeForm = (nodeData as any)?.NodeForm;

  return (
    <LogicFlowShell
      flow={flow}
      navbar={
        <Navbar
          width={{ base: NAVBAR_WIDTH }}
          sx={{
            height: `calc(100% - ${HEADER_HEIGHT}px)`,
          }}
        >
          <Navbar.Section grow component={ScrollArea}>
            <Stack px="md" py="lg">
              <TextInput
                placeholder="Search"
                mb="xs"
                icon={<IconSearch size={14} />}
                defaultValue={filter}
                onChange={(event) => setFilter(event.currentTarget.value)}
              />
              <Stack mb="lg">
                {filterNodes().map((key: string) => {
                  return <FlowNode key={key} type={key as PossibleNodes} />;
                })}
              </Stack>
            </Stack>
          </Navbar.Section>
        </Navbar>
      }
      aside={
        <Aside
          key={selectedNode?.id}
          width={{ base: ASIDE_WIDTH }}
          sx={{
            height: `calc(100% - ${HEADER_HEIGHT}px)`,
          }}
        >
          <Aside.Section grow component={ScrollArea}>
            <Stack px="md" py="lg">
              {!selectedNode && (
                <Center>
                  <Text size="sm" color="dimmed">
                    Double click a node to select it
                  </Text>
                </Center>
              )}
              {selectedNode?.id === "start-node" && (
                <Center>
                  <Text size="sm" color="dimmed">
                    You can&apos;t edit the Start Node
                  </Text>
                </Center>
              )}
              {selectedNode && selectedNode?.id !== "start-node" && (
                <Stack>
                  <Text size="sm">
                    Edit {startCase(selectedNode.data?.label)} Node
                  </Text>
                  <form onSubmit={form.onSubmit(onSubmit)}>
                    <TextInput
                      size="xs"
                      label="Label"
                      placeholder="Label"
                      {...form.getInputProps("label")}
                      mb="sm"
                    />
                    <NodeForm
                      key={selectedNode?.id}
                      form={form}
                      data={selectedNode.data}
                    />
                  </form>
                </Stack>
              )}
            </Stack>
          </Aside.Section>
        </Aside>
      }
    >
      <Box
        ref={reactFlowWrapper}
        style={{
          width: `calc(100vw - ${NAVBAR_WIDTH}px - ${ASIDE_WIDTH}px)`,
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          backgroundColor: theme.colors.gray[0],
        }}
      >
        <LogicFlow key={flow?.id} wrapperRef={reactFlowWrapper} />
      </Box>
    </LogicFlowShell>
  );
}
