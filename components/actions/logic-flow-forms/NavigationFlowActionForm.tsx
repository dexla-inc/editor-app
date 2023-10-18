import { QueryStringsForm } from "@/components/QueryStringsForm";
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
};

type FormValues = Omit<NavigationAction, "name">;

export const NavigationFlowActionForm = ({ form }: Props) => {
  const isUpdating = useFlowStore((state) => state.isUpdating);

  const setTree = useEditorStore((state) => state.setTree);

  const pages = useEditorStore((state) => state.pages);
  const { page } = useRequestProp();
  const pageId = form.getInputProps("pageId").value;

  const pageQueryStrings = useMemo(() => {
    if (page?.id === pageId && page?.queryStrings) {
      return page.queryStrings;
    }

    return pages.find((page) => page.id === pageId)?.queryStrings ?? {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages, pageId, page]);

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
