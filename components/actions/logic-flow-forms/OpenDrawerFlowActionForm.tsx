import { useRequestProp } from "@/hooks/useRequestProp";
import { useEditorStore } from "@/stores/editor";
import { useFlowStore } from "@/stores/flow";
import { OpenDrawerAction } from "@/utils/actions";
import { decodeSchema } from "@/utils/compression";
import { Component, getAllComponentsByName } from "@/utils/editor";
import { Button, Select, Stack } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useEffect } from "react";

type Props = {
  form: UseFormReturnType<FormValues>;
  actionName?: string;
};

type FormValues = Omit<OpenDrawerAction, "name">;

export const OpenDrawerFlowActionForm = ({ form, actionName }: Props) => {
  const isUpdating = useFlowStore((state) => state.isUpdating);
  const setTree = useEditorStore((state) => state.setTree);
  const editorTree = useEditorStore((state) => state.tree);

  const drawers = getAllComponentsByName(editorTree.root, "Drawer");

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
          actionName === "closeDrawer" ? "Drawer to Close" : "Drawer to Open"
        }
        placeholder="Select a drawer"
        data={drawers.map((drawer: Component) => {
          return {
            label: drawer.props?.title ?? drawer.id,
            value: drawer.id!,
          };
        })}
        {...form.getInputProps("drawerId")}
      />

      <Button type="submit" size="xs" loading={isUpdating}>
        Save
      </Button>
    </Stack>
  );
};
