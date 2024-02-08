import { useEditorStore } from "@/stores/editor";
import { OpenPopOverAction } from "@/utils/actions";
import { Component, getAllComponentsByName } from "@/utils/editor";
import { Select, Stack } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

type Props = {
  form: UseFormReturnType<Omit<OpenPopOverAction, "name">>;
};

export const OpenPopOverActionForm = ({ form }: Props) => {
  const editorTree = useEditorStore((state) => state.tree);

  const popOvers = getAllComponentsByName(editorTree.root, "PopOver");

  return (
    <Stack spacing="xs">
      <Select
        size="xs"
        // label={
        //   action.action?.name === "openPopOver"
        //     ? "PopOver to Open"
        //     : "PopOver to Close"
        // }
        placeholder="Select a popOver"
        data={popOvers.map((popOver: Component) => {
          return {
            label: popOver.props?.title ?? popOver.id,
            value: popOver.id!,
          };
        })}
        {...form.getInputProps("popOverId")}
      />
    </Stack>
  );
};
