import { useEditorStore } from "@/stores/editor";
import { OpenModalAction } from "@/utils/actions";
import { Component, getAllComponentsByName } from "@/utils/editor";
import { Select, Stack } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

type Props = {
  form: UseFormReturnType<Omit<OpenModalAction, "name">>;
};

export const OpenModalActionForm = ({ form }: Props) => {
  const editorTree = useEditorStore((state) => state.tree);

  // const isActionOpenModal = action.action?.name === "openModal";

  const modals = getAllComponentsByName(editorTree.root, "Modal");

  return (
    <Stack spacing="xs">
      <Select
        size="xs"
        // label={`Modal to ${isActionOpenModal ? "Open" : "Close"}`}
        placeholder="Select a modal"
        data={modals.map((modal: Component) => {
          return {
            label: modal.props?.title ?? modal.id,
            value: modal.id!,
          };
        })}
        {...form.getInputProps("modalId")}
      />
    </Stack>
  );
};
