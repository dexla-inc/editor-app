import { ActionButtons } from "@/components/actions/ActionButtons";
import {
  handleLoadingStart,
  handleLoadingStop,
  updateActionInTree,
  useActionData,
  useEditorStores,
  useLoadingState,
} from "@/components/actions/_BaseActionFunctions";
import { GoToUrlAction } from "@/utils/actions";
import { Checkbox, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { VariablePicker } from "@/components/VariablePicker";

type Props = {
  id: string;
};

type FormValues = Omit<GoToUrlAction, "name">;

export const GoToUrlForm = ({ id }: Props) => {
  const { startLoading, stopLoading } = useLoadingState();
  const { editorTree, selectedComponentId, updateTreeComponentActions } =
    useEditorStores();
  const { componentActions, action } = useActionData<GoToUrlAction>({
    actionId: id,
    editorTree,
    selectedComponentId,
  });

  const form = useForm<FormValues>({
    initialValues: {
      url: action.action.url,
      openInNewTab: action.action.openInNewTab,
    },
  });

  const onSubmit = (values: FormValues) => {
    handleLoadingStart({ startLoading });

    try {
      updateActionInTree<GoToUrlAction>({
        id,
        selectedComponentId: selectedComponentId!,
        componentActions,
        updateValues: { url: values.url, openInNewTab: values.openInNewTab },
        updateTreeComponentActions,
      });

      handleLoadingStop({ stopLoading });
    } catch (error) {
      handleLoadingStop({ stopLoading, success: false });
    }
  };

  const openInNewTabInputProps = form.getInputProps("openInNewTab");

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack>
        <TextInput
          size="xs"
          placeholder="Enter a URL"
          label="URL"
          {...form.getInputProps("url")}
          rightSection={
            <VariablePicker
              onSelectValue={(selected) => {
                form.setFieldValue("url", selected);
              }}
            />
          }
        />
        <Checkbox
          label="Open in new tab"
          {...openInNewTabInputProps}
          checked={openInNewTabInputProps.value}
        />
        <ActionButtons actionId={id} componentActions={componentActions} />
      </Stack>
    </form>
  );
};
