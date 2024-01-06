import { modals } from "@mantine/modals";
import { ActionIcon, Button, Flex } from "@mantine/core";
import { IconArrowBack } from "@tabler/icons-react";
import { useFlowStore } from "@/stores/flow";

export const useLogicFlows = () => {
  const setShowFormModal = useFlowStore((state) => state.setShowFormModal);

  const openLogicFlowsModal = () =>
    modals.openContextModal({
      modal: "logicFlows",
      title: (
        <Flex justify="space-between" mr={10}>
          <Flex align="center" gap={10}>
            Logic Flows{" "}
            <ActionIcon>
              <IconArrowBack />
            </ActionIcon>
          </Flex>

          <Button onClick={() => setShowFormModal(true)} compact>
            Create Logic Flow
          </Button>
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
