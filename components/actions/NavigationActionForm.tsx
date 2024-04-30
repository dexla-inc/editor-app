import { ActionFormProps, NavigationAction } from "@/utils/actions";
import {
  Button,
  Flex,
  Group,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useState } from "react";
import { SegmentedControlYesNo } from "../SegmentedControlYesNo";
import { usePageListQuery } from "@/hooks/editor/reactQuery/usePageListQuery";
import { useRouter } from "next/router";
import { QueryStringListItem } from "@/requests/pages/types";
import { ActionIconDefault } from "../ActionIconDefault";
import { ComponentToBindFromInput } from "../ComponentToBindFromInput";
import { ICON_DELETE, ICON_SIZE } from "@/utils/config";
import { Icon } from "../Icon";

type Props = ActionFormProps<Omit<NavigationAction, "name">>;

export const NavigationActionForm = ({ form, isPageAction }: Props) => {
  const router = useRouter();
  const projectId = router.query.id as string;
  const { data: pageListQuery } = usePageListQuery(projectId, null);

  // Local state to handle query strings
  const initialQueryStrings = Object.entries(
    form.values.queryStrings || {},
  ).map(([key, value]) => ({
    key,
    value,
  }));

  // Local state to handle query strings initialized from form values
  const [queryStrings, setQueryStrings] =
    useState<QueryStringListItem[]>(initialQueryStrings);

  // Function to handle adding new query string to local state and form
  const handleAddQueryString = (key: string, value: string) => {
    const newQueryStrings = queryStrings.concat({ key, value });
    setQueryStrings(newQueryStrings);
    form.setFieldValue(
      "queryStrings",
      newQueryStrings.reduce(
        (acc, { key, value }) => {
          acc[key] = value;
          return acc;
        },
        {} as Record<string, string>,
      ),
    );
  };

  const updateFormState = (queryStrings: QueryStringListItem[]) => {
    form.setFieldValue(
      "queryStrings",
      queryStrings.reduce(
        (acc, { key, value }) => {
          acc[key] = value;
          return acc;
        },
        {} as Record<string, string>,
      ),
    );
  };

  const handleQueryStringChange = (
    key: string,
    value: string,
    index: number,
  ) => {
    const newQueryStrings = queryStrings.map((qs, qsIndex) => {
      if (index === qsIndex) {
        return { ...qs, key, value };
      }
      return qs;
    });
    setQueryStrings(newQueryStrings);
    updateFormState(newQueryStrings);
  };

  return (
    <Stack>
      {/* TODO: This should only be visible on page actions */}
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
        data={
          pageListQuery?.results.map((page) => {
            return {
              label: page.title,
              value: page.id,
            };
          }) ?? []
        }
        {...form.getInputProps("pageId")}
        onChange={(value) => {
          const page = pageListQuery?.results.find((page) => page.id === value);
          form.setValues({
            pageId: value as string,
            pageSlug: page?.slug ?? "",
          });
        }}
      />
      <Flex justify="space-between" align="center">
        <Text fz="xs" weight="500">
          Query Strings
        </Text>

        <Button
          type="button"
          compact
          onClick={() => handleAddQueryString("", "")}
          variant="default"
          sx={{ marginRight: 0 }}
          leftIcon={<Icon name="IconPlus" size={ICON_SIZE} />}
        >
          Add
        </Button>
      </Flex>
      {queryStrings.map(({ key, value }, index) => (
        <Group key={index} style={{ flexWrap: "nowrap" }}>
          <TextInput
            placeholder="key"
            value={key}
            onChange={(event) =>
              handleQueryStringChange(
                event.target.value,
                queryStrings[index].value,
                index,
              )
            }
            size="xs"
            style={{ width: "50%" }}
          />
          <TextInput
            placeholder="value"
            value={value}
            onChange={(event) =>
              handleQueryStringChange(
                queryStrings[index].key,
                event.target.value,
                index,
              )
            }
            size="xs"
            style={{ width: "50%" }}
          />
          {/* <ComponentToBindFromInput
        size="xs"
        placeholder="value"
        label=""
        isPageAction={isPageAction}
        {...form.getInputProps(`queryStrings.${index}.value`)}
        onChange={(event) => handleQueryStringChange(queryStrings[index].key, value, index)}
      /> */}
          <ActionIconDefault
            iconName={ICON_DELETE}
            tooltip="Delete"
            onClick={() => {
              const newQueryStrings = queryStrings.filter(
                (_, i) => i !== index,
              );
              setQueryStrings(newQueryStrings);
            }}
          />
        </Group>
      ))}
    </Stack>
  );
};
