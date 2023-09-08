import { ActionButtons } from "@/components/actions/ActionButtons";
import {
  handleLoadingStart,
  handleLoadingStop,
  updateActionInTree,
  useActionData,
  useEditorStores,
  useLoadingState,
} from "@/components/actions/_BaseActionFunctions";
import { useEditorStore } from "@/stores/editor";
import { NavigationAction } from "@/utils/actions";
import { Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
type Props = {
  id: string;
};

type FormValues = Omit<NavigationAction, "name">;

export const NavigationActionForm = ({ id }: Props) => {
  const { startLoading, stopLoading } = useLoadingState();
  const { editorTree, selectedComponentId, updateTreeComponentActions } =
    useEditorStores();
  const { componentActions, action } = useActionData<NavigationAction>({
    actionId: id,
    editorTree,
    selectedComponentId,
  });
  const pages = useEditorStore((state) => state.pages);

  const form = useForm<FormValues>({
    initialValues: {
      pageId: action.action.pageId,
    },
  });

  const onSubmit = (values: FormValues) => {
    handleLoadingStart({ startLoading });

    try {
      updateActionInTree<NavigationAction>({
        selectedComponentId: selectedComponentId!,
        componentActions,
        id,
        updateValues: { pageId: values.pageId },
        updateTreeComponentActions,
      });

      handleLoadingStop({ stopLoading });
    } catch (error) {
      handleLoadingStop({ stopLoading, success: false });
    }
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack>
        <Select
          size="xs"
          placeholder="Select a page"
          label="Page"
          searchable
          data={pages.map((page) => {
            return {
              label: page.title,
              value: page.id,
            };
          })}
          {...form.getInputProps("pageId")}
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
