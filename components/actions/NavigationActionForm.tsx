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
import { QueryStringsForm } from "@/components/QueryStringsForm";
import { useEffect, useMemo, useState } from "react";
import { QueryStringListItem } from "@/requests/pages/types";
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

  const pageId = form.getInputProps("pageId").value;

  const pageQueryStrings = useMemo(() => {
    if (action.action.pageId === pageId && action.action.queryStrings) {
      return action.action.queryStrings;
    }

    return pages.find((page) => page.id === pageId)?.queryStrings ?? {};
  }, [pages, pageId, action.action]);

  const queryStringState = useState<Array<{ key: string; value: string }>>([]);

  useEffect(() => {
    queryStringState[1](
      Object.entries(pageQueryStrings).map(([key, value]) => ({
        key,
        value,
      })),
    );
  }, [pageQueryStrings]);

  const onSubmit = (values: FormValues) => {
    handleLoadingStart({ startLoading });

    const queryStrings = queryStringState[0].reduce(
      (acc: Record<string, string>, item: QueryStringListItem) => {
        acc[item.key] = item.value;
        return acc;
      },
      {},
    );

    try {
      updateActionInTree<NavigationAction>({
        selectedComponentId: selectedComponentId!,
        componentActions,
        id,
        updateValues: { pageId: values.pageId, queryStrings },
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
        {!!queryStringState[0].length && (
          <QueryStringsForm queryStringState={queryStringState} readOnlyKeys />
        )}
        <ActionButtons
          actionId={id}
          componentActions={componentActions}
          selectedComponentId={selectedComponentId}
        ></ActionButtons>
      </Stack>
    </form>
  );
};
