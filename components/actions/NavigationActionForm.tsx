import { QueryStringsForm } from "@/components/QueryStringsForm";
import { useEditorStore } from "@/stores/editor";
import { ActionFormProps, NavigationAction } from "@/utils/actions";
import { Select, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
type Props = ActionFormProps<Omit<NavigationAction, "name">>;

export const NavigationActionForm = ({ form }: Props) => {
  const pages = useEditorStore((state) => state.pages);

  const pageId = form.getInputProps("pageId").value;

  const pageQueryStrings =
    pages.find((page) => page.id === pageId)?.queryStrings ?? {};

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
        //required
        {...form.getInputProps("pageId")}
        onChange={(value) => {
          const page = pages.find((page) => page.id === value);
          form.setValues({
            pageId: value as string,
            pageSlug: page?.slug ?? "",
          });
        }}
      />
      {!!queryStringState[0].length && (
        <QueryStringsForm queryStringState={queryStringState} readOnlyKeys />
      )}
    </Stack>
  );
};
