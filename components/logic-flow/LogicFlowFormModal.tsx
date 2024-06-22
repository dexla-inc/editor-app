import {
  createLogicFlow,
  patchLogicFlow,
} from "@/requests/logicflows/mutations";
import { LogicFlowParams } from "@/requests/logicflows/types";
import { useAppStore } from "@/stores/app";
import { initialEdges, initialNodes, useFlowStore } from "@/stores/flow";
import { encodeSchema } from "@/utils/compression";
import { convertToPatchParams } from "@/types/dashboardTypes";
import { Button, Modal, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useEditorParams } from "@/hooks/editor/useEditorParams";

export const LogicFlowFormModal = () => {
  const { id: projectId } = useEditorParams();
  const client = useQueryClient();
  const shouldShowFormModal = useFlowStore(
    (state) => state.shouldShowFormModal,
  );
  const setShowFormModal = useFlowStore((state) => state.setShowFormModal);
  const currentFlow = useFlowStore((state) => state.currentFlow);
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const isLoading = useAppStore((state) => state.isLoading);

  const form = useForm({
    initialValues: {
      name: currentFlow?.name ?? "",
    },
  });

  const updateFlow = useMutation({
    mutationKey: ["logic-flow", currentFlow?.id],
    mutationFn: async (values: any) => {
      const patchParams =
        convertToPatchParams<Partial<LogicFlowParams>>(values);
      return await patchLogicFlow(
        projectId,
        currentFlow?.id as string,
        patchParams,
      );
    },
    onSettled: async () => {
      await client.refetchQueries({ queryKey: ["logic-flows", projectId] });
      setShowFormModal(false);
      stopLoading({
        id: "logic-flows",
        title: "Logic flow saved",
        message: "Logic flow saved successfully",
      });
      setIsLoading(false);
    },
  });

  const createFlow = useMutation({
    mutationKey: ["logic-flow"],
    mutationFn: async (values: any) => {
      const newFlow = {
        edges: initialEdges,
        nodes: initialNodes,
      };

      return createLogicFlow(projectId as string, {
        ...values,
        data: encodeSchema(JSON.stringify(newFlow)),
      });
    },
    onSettled: async (data, error) => {
      await client.refetchQueries({ queryKey: ["logic-flows", projectId] });

      if (!data?.id) {
        stopLoading({
          id: "logic-flows",
          title: "Oops",
          message: (error?.message as string) ?? "Something went wrong",
          isError: true,
        });
      } else {
        stopLoading({
          id: "logic-flows",
          title: "Logic flow saved",
          message: "Logic flow saved successfully",
        });
        setShowFormModal(false);
        form.setValues({
          name: "",
        });
      }
    },
  });

  const onSubmit = async (values: any) => {
    try {
      setIsLoading(true);
      startLoading({
        id: "logic-flows",
        title: "Saving logic flow",
        message: "Shouldn't take too long....",
      });

      if (currentFlow?.id) {
        updateFlow.mutate(values);
      } else {
        createFlow.mutate(values);
      }
    } catch (error) {
      console.error({ error });
      stopLoading({
        id: "logic-flows",
        title: "Oops",
        message: "Something went wrong",
        isError: true,
      });
    }
  };

  useEffect(() => {
    if (currentFlow) {
      form.setValues({
        name: currentFlow.name,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, currentFlow]);

  return (
    <Modal
      centered
      opened={shouldShowFormModal ?? false}
      onClose={() => {
        setShowFormModal(false);
        form.setValues({
          name: "",
        });
      }}
      title={currentFlow?.id ? "Edit Logic Flow" : "Create Logic Flow"}
      styles={{ overlay: { zIndex: 300 }, inner: { zIndex: 400 } }}
    >
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack>
          <TextInput
            required
            label="Name"
            {...form.getInputProps("name")}
            withAsterisk={false}
          />
          <Button type="submit" loading={isLoading} compact>
            {currentFlow?.id ? "Save" : "Create"}
          </Button>
        </Stack>
      </form>
    </Modal>
  );
};
