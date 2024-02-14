import { QueryStringsForm } from "@/components/QueryStringsForm";
import { useEditorStore } from "@/stores/editor";
import { ActionFormProps, NavigationAction } from "@/utils/actions";
import { Select, Stack } from "@mantine/core";
import { useState } from "react";
import { SegmentedControlYesNo } from "../SegmentedControlYesNo";

type Props = ActionFormProps<Omit<NavigationAction, "name">>;

export const NavigationActionForm = ({ form }: Props) => {
  const pages = useEditorStore((state) => state.pages);

  const pageId = form.getInputProps("pageId").value;

  const pageQueryStrings =
    pages.find((page) => page.id === pageId)?.queryStrings ?? {};

  const queryStringState = useState<Array<{ key: string; value: string }>>(
    Object.entries(pageQueryStrings).map(([key, value]) => ({
      key,
      value,
    })),
  );

  return (
    <Stack>
      {/* This should only be visible on page actions */}
      <SegmentedControlYesNo
        label="Run in edit mode"
        {...form.getInputProps("runInEditMode")}
        onChange={(value) => {
          form.setFieldValue("runInEditMode", value);
        }}
      />
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
