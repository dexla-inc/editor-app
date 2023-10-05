import { DataPicker } from "@/components/DataPicker";
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
import {
  Component,
  getAllParentsWithExampleData,
  getComponentById,
} from "@/utils/editor";
import { Checkbox, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import isEmpty from "lodash.isempty";

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

  const allParentsWithExampleData = getAllParentsWithExampleData(
    editorTree.root,
    selectedComponentId!,
  );

  const parentData = allParentsWithExampleData.reduce(
    (acc: any, parent: Component) => {
      return {
        ...acc,
        [parent.id!]: parent.props?.exampleData.value,
      };
    },
    {},
  );

  const openInNewTabInputProps = form.getInputProps("openInNewTab");
  const component = getComponentById(editorTree.root, selectedComponentId!);
  const exampleData = isEmpty(component?.props?.exampleData?.value)
    ? {}
    : {
        [selectedComponentId!]: component?.props?.exampleData.value,
      };

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack>
        <TextInput
          size="xs"
          placeholder="Enter a URL"
          label="URL"
          {...form.getInputProps("url")}
          rightSection={
            <DataPicker
              data={{ ...parentData, ...exampleData }}
              onSelectValue={(selected) => {
                form.setFieldValue("url", `dataPath_${selected}`);
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
