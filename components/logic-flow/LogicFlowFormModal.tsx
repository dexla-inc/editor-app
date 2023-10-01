import { useAppStore } from "@/stores/app";
import { initialEdges, initialNodes, useFlowStore } from "@/stores/flow";
import { encodeSchema } from "@/utils/compression";
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

  const updateFlow = useMutation({
    mutationKey: ["logic-flow", currentFlowId],
    mutationFn: async (values: any) => {
      return await fetch(`/api/logic-flows/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values, id: currentFlowId }),
      });
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
    },
  });

  const createFlow = useMutation({
    mutationKey: ["logic-flow"],
    mutationFn: async (values: any) => {
      const newFlow = {
        edges: initialEdges,
        nodes: initialNodes,
      };

      return await fetch(`/api/logic-flows/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          data: encodeSchema(JSON.stringify(newFlow)),
          projectId: router.query.id,
          pageId: router.query.page,
        }),
      });
    },
    onSettled: async (data) => {
      await client.refetchQueries([
        "logic-flows",
        router.query.id,
        router.query.page,
      ]);
      setShowFormModal(false);

      const json = await data?.json();

      if (!json.id) {
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
          `/projects/${router.query.id}/editor/${router.query.page}/flows/${json.id}`,
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
        const response = await fetch(`/api/logic-flows/${currentFlowId}`);
        const flow = await response.json();

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
  }, [currentFlowId]);

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
          <Button type="submit">{currentFlowId ? "Save" : "Create"}</Button>
        </Stack>
      </form>
    </Modal>
  );
};
