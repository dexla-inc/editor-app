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
  actionName?: string;
};

type FormValues = Omit<OpenModalAction, "name">;

export const OpenModalFlowActionForm = ({ form, actionName }: Props) => {
  const isUpdating = useFlowStore((state) => state.isUpdating);
  const setTree = useEditorStore((state) => state.setTree);
  const editorTree = useEditorStore((state) => state.tree);

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
        label={actionName === "closeModal" ? "Modal to Close" : "Modal to Open"}
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
