import { useRequestProp } from "@/hooks/useRequestProp";
import { useEditorStore } from "@/stores/editor";
import { useFlowStore } from "@/stores/flow";
import { OpenPopOverAction } from "@/utils/actions";
import { decodeSchema } from "@/utils/compression";
import { Component, getAllComponentsByName } from "@/utils/editor";
import { Button, Select, Stack } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useEffect } from "react";

type Props = {
  actionName?: string;
  form: UseFormReturnType<FormValues>;
};

type FormValues = Omit<OpenPopOverAction, "name">;

export const OpenPopOverFlowActionForm = ({ actionName, form }: Props) => {
  const isUpdating = useFlowStore((state) => state.isUpdating);

  const { tree: editorTree, setTree } = useEditorStore();

  const { page } = useRequestProp();

  useEffect(() => {
    if (page?.pageState) {
      setTree(JSON.parse(decodeSchema(page.pageState)));
    }
  }, [page?.pageState, setTree]);

  const popOvers = getAllComponentsByName(editorTree.root, "PopOver");

  return (
    <Stack spacing="xs">
      <Select
        size="xs"
        label={
          actionName === "closePopOver" ? "PopOver to Close" : "PopOver to Open"
        }
        placeholder="Select a popOver"
        data={popOvers.map((popOver: Component) => {
          return {
            label: popOver.props?.title ?? popOver.id,
            value: popOver.id!,
          };
        })}
        {...form.getInputProps("popOverId")}
      />

      <Button type="submit" size="xs" loading={isUpdating}>
        Save
      </Button>
    </Stack>
  );
};
