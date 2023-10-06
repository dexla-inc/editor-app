import { useActionData } from "@/components/actions/_BaseActionFunctions";
import { useRequestProp } from "@/hooks/useRequestProp";
import { useEditorStore } from "@/stores/editor";
import { useFlowStore } from "@/stores/flow";
import { OpenModalAction } from "@/utils/actions";
import { decodeSchema } from "@/utils/compression";
import { Component, getAllComponentsByName } from "@/utils/editor";
import { Button, Select, Stack } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useEffect } from "react";

type Props = {
  form: UseFormReturnType<FormValues>;
  id: string;
};

type FormValues = Omit<OpenModalAction, "name">;

export const OpenModalFlowActionForm = ({ form, id }: Props) => {
  const isUpdating = useFlowStore((state) => state.isUpdating);
  const { tree: editorTree, selectedComponentId, setTree } = useEditorStore();

  const { action } = useActionData<OpenModalAction>({
    actionId: id,
    editorTree,
    selectedComponentId,
  });

  const modals = getAllComponentsByName(editorTree.root, "Modal");

  const { page } = useRequestProp();

  useEffect(() => {
    if (page?.pageState) {
      setTree(JSON.parse(decodeSchema(page.pageState)));
    }
  }, [page?.pageState, setTree]);

  return (
    <Stack spacing="xs">
      <Select
        size="xs"
        label={
          action.action.name === "openModal"
            ? "Modal to Open"
            : "Modal to Close"
        }
        placeholder="Select a modal"
        data={modals.map((modal: Component) => {
          return {
            label: modal.props?.title ?? modal.id,
            value: modal.id!,
          };
        })}
        {...form.getInputProps("modalId")}
      />

      <Button type="submit" size="xs" loading={isUpdating}>
        Save
      </Button>
    </Stack>
  );
};
