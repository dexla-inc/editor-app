import { modals } from "@mantine/modals";
import { ActionIcon, Button, Flex } from "@mantine/core";
import { IconArrowBack } from "@tabler/icons-react";
import { useFlowStore } from "@/stores/flow";
import { VariablesButton } from "@/components/variables/VariablesButton";
import { useEditorStore } from "@/stores/editor";

export const useLogicFlows = () => {
  const setShowFormModal = useFlowStore((state) => state.setShowFormModal);
  const pageId = useEditorStore((state) => state.currentPageId);
  const projectId = useEditorStore((state) => state.currentProjectId);
  const setSelectedTabView = useFlowStore((state) => state.setSelectedTabView);
  const selectedTabView = useFlowStore((state) => state.selectedTabView);

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
            <ActionIcon onClick={() => setSelectedTabView("list")}>
              <IconArrowBack />
            </ActionIcon>
          </Flex>

          <Flex align="center" gap={5}>
            <Button onClick={() => setShowFormModal(true)} compact>
              Create Logic Flow
            </Button>
            <VariablesButton pageId={pageId!} projectId={projectId!} />
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

  return {
    openLogicFlowsModal,
  };
};
