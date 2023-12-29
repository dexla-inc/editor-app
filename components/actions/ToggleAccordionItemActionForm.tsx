import { ActionButtons } from "@/components/actions/ActionButtons";
import {
  handleLoadingStart,
  handleLoadingStop,
  updateActionInTree,
  useActionData,
  useLoadingState,
} from "@/components/actions/_BaseActionFunctions";
import { useEditorStore } from "@/stores/editor";
import { ToggleAccordionItemAction } from "@/utils/actions";
import { Component, getAllComponentsByName } from "@/utils/editor";
import { Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";

type Props = {
  id: string;
};

type FormValues = Omit<ToggleAccordionItemAction, "name">;

export const ToggleAccordionItemActionForm = ({ id }: Props) => {
  const { startLoading, stopLoading } = useLoadingState();
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
  );
  const updateTreeComponentActions = useEditorStore(
    (state) => state.updateTreeComponentActions,
  );
  const { componentActions, action } = useActionData<ToggleAccordionItemAction>(
    {
      actionId: id,
      editorTree,
      selectedComponentId,
    },
  );

  const form = useForm<FormValues>({
    initialValues: {
      accordionId: action.action?.accordionId,
      accordionItemId: action.action?.accordionItemId,
    },
  });

  const onSubmit = (values: FormValues) => {
    handleLoadingStart({ startLoading });

    try {
      updateActionInTree<ToggleAccordionItemAction>({
        selectedComponentId: selectedComponentId!,
        componentActions,
        id,
        updateValues: {
          accordionId: values.accordionId,
          accordionItemId: values.accordionItemId,
        },
        updateTreeComponentActions,
      });

      handleLoadingStop({ stopLoading });
    } catch (error) {
      handleLoadingStop({ stopLoading, success: false });
    }
  };

  const accordions = getAllComponentsByName(editorTree.root, "Accordion");
  let accordionItems: Component[] = [];
  if (form.values.accordionId) {
    const accordion = accordions.find((c) => c.id === form.values.accordionId);
    accordionItems = getAllComponentsByName(accordion!, "AccordionItem");
  }

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
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
        <ActionButtons
          actionId={action.id}
          componentActions={componentActions}
        ></ActionButtons>
      </Stack>
    </form>
  );
};
