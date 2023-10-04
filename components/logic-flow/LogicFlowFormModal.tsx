import {
  createLogicFlow,
  patchLogicFlow,
} from "@/requests/logicflows/mutations";
import { getLogicFlow } from "@/requests/logicflows/queries";
import { LogicFlowParams } from "@/requests/logicflows/types";
import { useAppStore } from "@/stores/app";
import { initialEdges, initialNodes, useFlowStore } from "@/stores/flow";
import { encodeSchema } from "@/utils/compression";
import { convertToPatchParams } from "@/utils/dashboardTypes";
import { Button, Checkbox, Modal, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const LogicFlowFormModal = () => {
  const router = useRouter();
  const client = useQueryClient();
  const shouldShowFormModal = useFlowStore(
    (state) => state.shouldShowFormModal,
  );
  const setShowFormModal = useFlowStore((state) => state.setShowFormModal);
  const currentFlowId = useFlowStore((state) => state.currentFlowId);
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const isLoading = useAppStore((state) => state.isLoading);

  const updateFlow = useMutation({
    mutationKey: ["logic-flow", currentFlowId],
    mutationFn: async (values: any) => {
      const patchParams =
        convertToPatchParams<Partial<LogicFlowParams>>(values);
      return await patchLogicFlow(
        router.query.id as string,
        currentFlowId as string,
        patchParams,
      );
    },
    onSettled: async () => {
      await client.refetchQueries([
        "logic-flows",
        router.query.id,
        router.query.page,
      ]);
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

      return createLogicFlow(router.query.id as string, {
        ...values,
        data: encodeSchema(JSON.stringify(newFlow)),
        pageId: router.query.page,
      });
    },
    onSettled: async (data) => {
      await client.refetchQueries([
        "logic-flows",
        router.query.id,
        router.query.page,
      ]);
      setShowFormModal(false);

      if (!data?.id) {
        stopLoading({
          id: "logic-flows",
          title: "Oops",
          message: "Something went wrong",
          isError: true,
        });
      } else {
        stopLoading({
          id: "logic-flows",
          title: "Logic flow saved",
          message: "Logic flow saved successfully",
        });

        router.push(
          `/projects/${router.query.id}/editor/${router.query.page}/flows/${data.id}`,
        );
      }
    },
  });

  const form = useForm({
    initialValues: {
      name: "",
      isGlobal: false,
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

      if (currentFlowId) {
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
    if (currentFlowId) {
      const getLogicFLow = async () => {
        const flow = await getLogicFlow(
          router.query.id as string,
          currentFlowId,
        );

        form.setValues({
          name: flow.name,
          isGlobal: flow.isGlobal,
        });
      };

      getLogicFLow();
    } else {
      form.setValues({
        name: "",
        isGlobal: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.id, currentFlowId]);

  return (
    <Modal
      centered
      opened={shouldShowFormModal ?? false}
      onClose={() => {
        setShowFormModal(false);
      }}
      title={currentFlowId ? "Edit Logic Flow" : "Create Logic Flow"}
    >
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack>
          <TextInput
            required
            label="Name"
            {...form.getInputProps("name")}
            withAsterisk={false}
          />
          <Checkbox
            label="Is Global"
            {...form.getInputProps("isGlobal", { type: "checkbox" })}
          />
          <Button type="submit" loading={isLoading}>
            {currentFlowId ? "Save" : "Create"}
          </Button>
        </Stack>
      </form>
    </Modal>
  );
};
