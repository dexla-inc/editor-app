import { EndpointSelect } from "@/components/EndpointSelect";

import { Endpoint } from "@/requests/datasources/types";
import { useInputsStore } from "@/stores/inputs";
import { getObjectAndArrayKeys } from "@/utils/common";
import { DEFAULT_STALE_TIME } from "@/utils/config";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { Box, Flex, Select, Text, TextInput } from "@mantine/core";
import { SegmentedControlYesNo } from "../SegmentedControlYesNo";

type Props = {
  response: any;
  form: any;
  componentId: string;
  setSelectedEndpoint: (endpoint: Endpoint) => void;
  endpoints: Endpoint[];
};

export const EndpointData = ({
  response,
  form,
  componentId,
  setSelectedEndpoint,
  endpoints,
}: Props) => {
  const setInputValue = useInputsStore((state) => state.setInputValue);

  const resultsKeysList = getObjectAndArrayKeys(response);

  const setOnLoadFormFieldValue = (attrs: any) => {
    form.setValues(attrs);
    debouncedTreeComponentAttrsUpdate({ onLoad: attrs });
  };

  return (
    <Box>
      <EndpointSelect
        {...form.getInputProps("endpointId")}
        onChange={(selected) => {
          const newValues = {
            endpointId: selected,
            staleTime: form.values.staleTime,
            dataLabelKey: "",
            dataValueKey: "",
            resultsKey: "",
          };
          setOnLoadFormFieldValue(newValues);
          setInputValue(componentId, "");
          setSelectedEndpoint(
            endpoints.find((e) => e.id === selected) as Endpoint,
          );
        }}
      />
      {form.values.endpointId && (
        <>
          <Flex align="end" gap="xs" justify="space-between">
            <SegmentedControlYesNo
              label="Cache Request"
              value={form.values.staleTime === 0 ? "false" : "true"}
              onChange={(value) => {
                setOnLoadFormFieldValue({
                  staleTime: value === "false" ? 0 : DEFAULT_STALE_TIME,
                });
              }}
            />
            <TextInput
              disabled={form.values.staleTime === 0}
              mt={8}
              w={80}
              {...form.getInputProps("staleTime")}
              onChange={(e) => {
                setOnLoadFormFieldValue({
                  staleTime: Number(e.target.value),
                });
              }}
              onBlur={(e) => {
                if (e.target.value === "") {
                  setOnLoadFormFieldValue({
                    staleTime: 0,
                  });
                }
              }}
              styles={{ rightSection: { right: "0.25rem" } }}
              rightSection={
                <Text size="xs" color="dimmed">
                  mins
                </Text>
              }
            />
          </Flex>
          {!Array.isArray(response) && (
            <Select
              clearable
              label="Results key"
              placeholder="user.list"
              data={resultsKeysList}
              {...form.getInputProps("resultsKey")}
              onChange={(selected) => {
                const newValues = {
                  dataLabelKey: "",
                  dataValueKey: "",
                  resultsKey: selected,
                };
                setInputValue(componentId, "");
                setOnLoadFormFieldValue(newValues);
              }}
            />
          )}
        </>
      )}
    </Box>
  );
};
