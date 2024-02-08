import { useEditorStore } from "@/stores/editor";
import { OpenDrawerAction } from "@/utils/actions";
import { Component, getAllComponentsByName } from "@/utils/editor";
import { Select, Stack } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

type Props = {
  form: UseFormReturnType<Omit<OpenDrawerAction, "name">>;
};

export const OpenDrawerActionForm = ({ form }: Props) => {
  const editorTree = useEditorStore((state) => state.tree);

  const drawers = getAllComponentsByName(editorTree.root, "Drawer");

  return (
    <Stack spacing="xs">
      <Select
        size="xs"
        // label={
        //   action.action?.name === "openDrawer"
        //     ? "Drawer to Open"
        //     : "Drawer to Close"
        // }
        placeholder="Select a drawer"
        data={drawers.map((drawer: Component) => {
          return {
            label: drawer.props?.title ?? drawer.id,
            value: drawer.id!,
          };
        })}
        {...form.getInputProps("drawerId")}
      />
    </Stack>
  );
};
