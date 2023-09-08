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
        selectedComponentId: selectedComponentId!,
        componentActions,
        id,
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
        ></TextInput>
        <Checkbox
          label="Open in new tab"
          {...openInNewTabInputProps}
          checked={openInNewTabInputProps.value}
        />
        <ActionButtons
          actionId={id}
          componentActions={componentActions}
          selectedComponentId={selectedComponentId}
        ></ActionButtons>
      </Stack>
    </form>
  );
};
