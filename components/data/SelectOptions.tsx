import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { Box, Select, Text, Title } from "@mantine/core";
import get from "lodash.get";
import { useMemo } from "react";

export const SelectOptions = ({ response, form }: any) => {
  const selectableObject = useMemo(
    () =>
      form.values.resultsKey ? get(response, form.values.resultsKey) : response,
    [response, form.values.resultsKey],
  );

  const selectableObjectKeys = useMemo(
    () =>
      Object.keys(
        Array.isArray(selectableObject)
          ? selectableObject[0]
          : selectableObject,
      ),
    [selectableObject],
  );

  const setOnLoadFormFieldValue = (attrs: any) => {
    form.setValues(attrs);
    debouncedTreeComponentAttrsUpdate({ onLoad: attrs });
  };

  return (
    <Box>
      <Title order={6} mt="xs">
        Options
      </Title>
      <Text size="xs" color="dimmed">
        Set up the data structure
      </Text>

      <Select
        label="Label"
        data={selectableObjectKeys}
        {...form.getInputProps("dataLabelKey")}
        onChange={(selected) => {
          setOnLoadFormFieldValue({ dataLabelKey: selected });
        }}
      />
      <Select
        label="Value"
        data={selectableObjectKeys}
        {...form.getInputProps("dataValueKey")}
        onChange={(selected) => {
          setOnLoadFormFieldValue({ dataValueKey: selected });
        }}
      />
    </Box>
  );
};
