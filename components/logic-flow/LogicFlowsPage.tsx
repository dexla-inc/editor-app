import { LogicFlow } from "@/components/logic-flow/LogicFlow";
import { LogicFlowShell } from "@/components/logic-flow/LogicFlowShell";
import { patchLogicFlow } from "@/requests/logicflows/mutations";
import { getLogicFlow } from "@/requests/logicflows/queries-noauth";
import { LogicFlowParams } from "@/requests/logicflows/types";
import { useEditorStore } from "@/stores/editor";
import { FlowData, useFlowStore } from "@/stores/flow";
import { LOGICFLOW_BACKGROUND } from "@/utils/branding";
import { decodeSchema, encodeSchema } from "@/utils/compression";
import { ASIDE_WIDTH, HEADER_HEIGHT, NAVBAR_WIDTH } from "@/utils/config";
import { convertToPatchParams } from "@/utils/dashboardTypes";
import { nodesData } from "@/utils/logicFlows";
import { removeKeysRecursive } from "@/utils/removeKeys";
import {
  Aside,
  Box,
  Center,
  ScrollArea,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { usePrevious } from "@mantine/hooks";
import {
  QueryClient,
  dehydrate,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import isEqual from "lodash.isequal";
import startCase from "lodash.startcase";
import { nanoid } from "nanoid";
import { GetServerSidePropsContext } from "next";
import { useCallback, useEffect, useRef } from "react";
import { useUpdateNodeInternals } from "reactflow";
import { actionMapper } from "@/utils/actions";

export const getServerSideProps = async ({
  query,
}: GetServerSidePropsContext) => {
  const queryClient = new QueryClient();
  const flowId = query.flow as string;

  await queryClient.prefetchQuery(["logic-flow", flowId], async () => {
    return await getLogicFlow(query.id! as string, flowId);
  });

  return {
    props: JSON.parse(
      JSON.stringify({
        id: query.id,
        flowId,
        dehydratedState: dehydrate(queryClient),
      }),
    ),
  };
};

type Props = {
  flowId: string;
};

export const LogicFlowsPage = ({ flowId }: Props) => {
  const reactFlowWrapper = useRef(null);
  const restoreFlow = useFlowStore((state) => state.restoreFlow);
  const selectedNode = useFlowStore((state) => state.selectedNode);
  const isRestored = useFlowStore((state) => state.isRestored);
  const isDragging = useFlowStore((state) => state.isDragging);
  const isUpdating = useFlowStore((state) => state.isUpdating);
  const setIsUpdating = useFlowStore((state) => state.setIsUpdating);
  const updateNodeData = useFlowStore((state) => state.updateNodeData);
  const state = useFlowStore((state) => ({
    nodes: state.nodes,
    edges: state.edges,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
    setIsRestored: state.setIsRestored,
  }));
  const updateNodeInternals = useUpdateNodeInternals();
  const previousSelectedNode = usePrevious(selectedNode);
  const id = useEditorStore((state) => state.currentProjectId ?? "");

  const { data: flow, isLoading: isFlowDataLoading } = useQuery({
    queryKey: ["logic-flow", id, flowId],
    queryFn: async () => {
      state.setIsRestored(false);
      const result = await getLogicFlow(id, flowId);

      if (result?.data) {
        const data = JSON.parse(decodeSchema(result.data as string));
        restoreFlow(data as any);
      }

      return result;
    },
    enabled: !!flowId,
  });

  const { mutate: updateFlow } = useMutation({
    mutationKey: ["logic-flow", flow?.id],
    mutationFn: async ({ values }: any) => {
      setIsUpdating(true);
      const patchParams = convertToPatchParams<Partial<LogicFlowParams>>({
        data: encodeSchema(JSON.stringify(values.data)),
      });
      const response = await patchLogicFlow(
        id,
        flow?.id as string,
        patchParams,
      );

      setIsUpdating(false);

      return response;
    },
  });

  const hasChanges = useCallback(() => {
    const flowData = flow?.data as unknown as FlowData;
    const nodes = state.nodes.map((n) =>
      removeKeysRecursive(n, ["width", "height"]),
    ) as FlowData["nodes"];
    const edges = state.edges;
    const equal =
      isEqual(nodes, flowData?.nodes) && isEqual(edges, flowData?.edges);

    return !equal;
  }, [flow?.data, state.edges, state.nodes]);

  useEffect(() => {
    if (isRestored && !isDragging && hasChanges() && !isFlowDataLoading) {
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
    isFlowDataLoading,
    state.nodes,
    state.edges,
    updateFlow,
    id,
  ]);

  const actionMapped = selectedNode?.data?.form?.action
    ? // @ts-ignore
      actionMapper[selectedNode.data.form.action]
    : null;

  const form = useForm({
    initialValues: {
      ...actionMapped?.defaultValues,
      label: selectedNode?.data.label ?? "",
    },
  });

  useEffect(() => {
    if (selectedNode && previousSelectedNode?.id !== selectedNode?.id) {
      form.setValues({
        ...actionMapped?.defaultValues,
        ...selectedNode.data.form,
        label: selectedNode.data.label,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNode, previousSelectedNode]);

  useEffect(() => {
    let timeout: string | number | NodeJS.Timeout = "";
    if (form.isTouched() && form.isDirty()) {
      timeout = setTimeout(() => onSubmit(form.values), 2000);
    }

    return () => clearTimeout(timeout);
  }, [form.values]);

  const onSubmit = async ({ label, ...values }: any) => {
    const isConditionalNode = selectedNode?.type === "conditionalNode";
    const connectedEdges = state.edges.filter(
      (edge) => edge.source === selectedNode?.id,
    );

    updateNodeData({
      id: selectedNode?.id,
      data: {
        label,
        form: values,
        ...(isConditionalNode ? { outputs: values.outputs } : {}),
      },
    });
    updateNodeInternals(selectedNode?.id!);
    values.outputs?.forEach((output: any, index: number) => {
      const connectedEdge = connectedEdges.find(
        (edge) => edge.sourceHandle === output.id,
      );

      if (!connectedEdge) {
        const addId = nanoid();
        state.onNodesChange([
          {
            item: {
              id: addId,
              type: "connectionCreatorNode",
              position: {
                x: selectedNode?.position?.x! + 100 * index,
                y: selectedNode?.position?.y! + 90,
              },
              data: {
                inputs: [{ id: nanoid() }],
              },
            },
            type: "add",
          },
        ]);

        state.onEdgesChange([
          {
            item: {
              id: nanoid(),
              target: addId,
              source: selectedNode?.id!,
              sourceHandle: output.id,
            },
            type: "add",
          },
        ]);
      }
    });
  };

  const nodeData = nodesData[selectedNode?.type as keyof typeof nodesData];
  const NodeForm = (nodeData as any)?.NodeForm;

  return (
    <LogicFlowShell
      flow={flow}
      aside={
        <Aside key={selectedNode?.id} width={{ base: ASIDE_WIDTH }}>
          <Aside.Section grow component={ScrollArea}>
            <Stack px="md" py="lg">
              {!selectedNode ? (
                <Center>
                  <Text size="sm" color="dimmed">
                    Click a node to select it
                  </Text>
                </Center>
              ) : selectedNode?.id === "start-node" ||
                selectedNode?.id === "add-node" ? (
                <Center>
                  <Text size="sm" color="dimmed">
                    You can&apos;t edit the Start Node
                  </Text>
                </Center>
              ) : (
                <Stack>
                  <Text size="sm">
                    Edit {startCase(selectedNode.data?.label)} Node
                  </Text>
                  <Stack>
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
                  </Stack>
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
          backgroundColor: LOGICFLOW_BACKGROUND,
        }}
      >
        <LogicFlow key={flow?.id} wrapperRef={reactFlowWrapper} />
      </Box>
    </LogicFlowShell>
  );
};
