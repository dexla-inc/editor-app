import BindingPopover from "@/components/BindingPopover";
import { ActionButtons } from "@/components/actions/ActionButtons";
import {
  handleLoadingStart,
  handleLoadingStop,
  updateActionInTree,
  useActionData,
  useLoadingState,
} from "@/components/actions/_BaseActionFunctions";
import { VariableSelect } from "@/components/variables/VariableSelect";
import { useEditorStore } from "@/stores/editor";
import { ChangeVariableAction } from "@/utils/actions";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import merge from "lodash.merge";

type Props = {
  id: string;
};

type FormValues = Omit<ChangeVariableAction, "name">;

const defaultValues = {
  variableId: "",
  bindingType: "JavaScript",
  javascriptCode: "return ",
  formulaCondition: "",
  formulaValue: "",
};

export const ChangeVariableActionForm = ({ id }: Props) => {
  const { startLoading, stopLoading } = useLoadingState();
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
  );
  const updateTreeComponentActions = useEditorStore(
    (state) => state.updateTreeComponentActions,
  );
  const { componentActions, action } = useActionData<ChangeVariableAction>({
    actionId: id,
    editorTree,
    selectedComponentId,
  });
  const [isBindable, { toggle: onTogglePopover, close: onClosePopover }] =
    useDisclosure(false);

  const form = useForm<FormValues>({
    initialValues: merge({}, defaultValues, action.action),
  });

  const onSubmit = (updateValues: FormValues) => {
    handleLoadingStart({ startLoading });

    try {
      updateActionInTree<ChangeVariableAction>({
        selectedComponentId: selectedComponentId!,
        componentActions,
        id,
        updateValues,
        updateTreeComponentActions,
      });

      handleLoadingStop({ stopLoading });
    } catch (error) {
      handleLoadingStop({ stopLoading, success: false });
    }
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack spacing="xs">
        <VariableSelect
          label="Variable"
          required
          onPick={(variable) => {
            form.setFieldValue("variableId", variable.id);
          }}
          {...form.getInputProps("variableId")}
        />

        <BindingPopover
          opened={isBindable}
          onTogglePopover={onTogglePopover}
          onClosePopover={onClosePopover}
          bindingType={form.values.bindingType as any}
          onChangeBindingType={(bindingType: any) => {
            form.setFieldValue("bindingType", bindingType);
          }}
          onChangeJavascriptCode={(javascriptCode: any) => {
            form.setFieldValue("javascriptCode", javascriptCode);
          }}
          javascriptCode={form.values.javascriptCode}
        />

        <ActionButtons
          actionId={action.id}
          componentActions={componentActions}
        ></ActionButtons>
      </Stack>
    </form>
  );
};
