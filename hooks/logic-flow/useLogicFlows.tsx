import { NodeData } from "@/components/logic-flow/nodes/CustomNode";
import { VariablesButton } from "@/components/variables/VariablesButton";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useFlowStore } from "@/stores/flow";
import { ActionIcon, Button, Flex } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconArrowBack } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { NodeProps } from "reactflow";

export const useLogicFlows = () => {
  const setShowFormModal = useFlowStore((state) => state.setShowFormModal);
  const projectId = useEditorTreeStore((state) => state.currentProjectId);
  const setSelectedTabView = useFlowStore((state) => state.setSelectedTabView);
  const selectedTabView = useFlowStore((state) => state.selectedTabView);
  const onNodesChange = useFlowStore((state) => state.onNodesChange);
  const onEdgesChange = useFlowStore((state) => state.onEdgesChange);
  const client = useQueryClient();

  const openLogicFlowsModal = () =>
    modals.openContextModal({
      modal: "logicFlows",
      onClose: () => {
        setSelectedTabView("list");
      },
      title: (
        <Flex justify="space-between" mr={10}>
          <Flex align="center" gap={10}>
            Logic Flows {selectedTabView}
            <ActionIcon
              onClick={async () => {
                setSelectedTabView("list");
                await client.refetchQueries({
                  queryKey: ["logic-flows", projectId],
                });
              }}
            >
              <IconArrowBack />
            </ActionIcon>
          </Flex>

          <Flex align="center" gap={5}>
            <Button onClick={() => setShowFormModal(true)} compact>
              Create Logic Flow
            </Button>
            <VariablesButton projectId={projectId!} />
          </Flex>
        </Flex>
      ),
      size: "auto",
      styles: {
        title: { width: "100%" },
        overlay: { zIndex: 300 },
        inner: { zIndex: 300 },
      },
      innerProps: {},
    });

  const addConnectionCreatorNode = (
    node: NodeProps<NodeData>,
    parentNodeId: string,
  ) => {
    const addId = nanoid();
    onNodesChange([
      {
        item: {
          id: addId,
          type: "connectionCreatorNode",
          position: { x: (node as any).xPos, y: (node as any).yPos + 72 },
          data: {
            inputs: [{ id: nanoid() }],
          },
          deletable: false,
        },
        type: "add",
      },
      {
        id: node.id,
        type: "remove",
      },
    ]);

    onEdgesChange([
      {
        item: { id: nanoid(), target: addId, source: parentNodeId },
        type: "add",
      },
    ]);
  };

  return {
    openLogicFlowsModal,
    addConnectionCreatorNode,
  };
};
