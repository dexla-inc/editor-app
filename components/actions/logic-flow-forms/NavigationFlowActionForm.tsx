import { QueryStringsForm } from "@/components/QueryStringsForm";
import { useActionData } from "@/components/actions/_BaseActionFunctions";
import { useRequestProp } from "@/hooks/useRequestProp";
import { useEditorStore } from "@/stores/editor";
import { useFlowStore } from "@/stores/flow";
import { NavigationAction } from "@/utils/actions";
import { decodeSchema } from "@/utils/compression";
import { Button, Select, Stack } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useEffect, useMemo, useState } from "react";
type Props = {
  form: UseFormReturnType<FormValues>;
  id: string;
};

type FormValues = Omit<NavigationAction, "name">;

export const NavigationFlowActionForm = ({ form, id }: Props) => {
  const isUpdating = useFlowStore((state) => state.isUpdating);

  const { tree: editorTree, selectedComponentId, setTree } = useEditorStore();
  const { action } = useActionData<NavigationAction>({
    actionId: id,
    editorTree,
    selectedComponentId,
  });
  const pages = useEditorStore((state) => state.pages);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageQueryStrings]);

  const { page } = useRequestProp();

  useEffect(() => {
    if (page?.pageState) {
      setTree(JSON.parse(decodeSchema(page.pageState)));
    }
  }, [page?.pageState, setTree]);

  return (
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

      <Button type="submit" size="xs" loading={isUpdating}>
        Save
      </Button>
    </Stack>
  );
};
