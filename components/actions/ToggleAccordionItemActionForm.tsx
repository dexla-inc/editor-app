import { useEditorStore } from "@/stores/editor";
import { ToggleAccordionItemAction } from "@/utils/actions";
import { Component, getAllComponentsByName } from "@/utils/editor";
import { Select, Stack } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

type Props = {
  form: UseFormReturnType<Omit<ToggleAccordionItemAction, "name">>;
};

export const ToggleAccordionItemActionForm = ({ form }: Props) => {
  const editorTree = useEditorStore((state) => state.tree);

  const accordions = getAllComponentsByName(editorTree.root, "Accordion");
  let accordionItems: Component[] = [];
  if (form.values.accordionId) {
    const accordion = accordions.find((c) => c.id === form.values.accordionId);
    accordionItems = getAllComponentsByName(accordion!, "AccordionItem");
  }

  return (
    <Stack spacing="xs">
      <Select
        size="xs"
        label={`Accordions`}
        placeholder="Select an accordion"
        data={accordions.map((accordion: Component) => accordion?.id!)}
        {...form.getInputProps("accordionId")}
      />
      {form.values.accordionId && (
        <Select
          size="xs"
          label={`Toggle Accordion Item`}
          placeholder="Select the accordion item"
          data={accordionItems.map(
            (accordionItem: Component) => accordionItem?.props?.value,
          )}
          {...form.getInputProps("accordionItemId")}
        />
      )}
    </Stack>
  );
};
