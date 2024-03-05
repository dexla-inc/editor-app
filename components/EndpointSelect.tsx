import { EndpointExampleResponsePreview } from "@/components/EndpointExampleResponsePreview";
import { colors } from "@/components/datasources/DataSourceEndpoint";
import { useDataSourceEndpoints } from "@/hooks/reactQuery/useDataSourceEndpoints";
import { Endpoint } from "@/requests/datasources/types";
import { MethodTypes } from "@/requests/types";
import { useEditorStore } from "@/stores/editor";
import { Box, Flex, Group, Select, SelectProps, Text } from "@mantine/core";
import { forwardRef, useCallback, useEffect, useMemo, useState } from "react";

const selectItemStyles = (method: MethodTypes) => ({
  fontSize: 8,
  color: "white",
  border: colors[method].color + " 1px solid",
  background: colors[method].color,
  borderRadius: "4px",
  width: 36,
  textAlign: "center" as const,
});

interface SelectItemProps {
  method: MethodTypes;
  label: string;
}

const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ method, label, ...others }, ref) => (
    <Flex ref={ref} gap="xs" {...others}>
      <Box p={2} sx={selectItemStyles(method)}>
        <Text size={8}>{method}</Text>
      </Box>
      <Text size="xs" truncate>
        {label}
      </Text>
    </Flex>
  ),
);

SelectItem.displayName = "EndpointSelectItem";
interface EndpointSelectProps extends Omit<SelectProps, "data"> {
  value?: string;
}

export const EndpointSelect = ({ value, ...props }: EndpointSelectProps) => {
  const projectId = useEditorStore((state) => state.currentProjectId);
  const { data: endpoints } = useDataSourceEndpoints(projectId);
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint>();

  const selectData = useMemo(() => {
    return (
      endpoints?.results?.map((endpoint) => ({
        label: `${endpoint.relativeUrl} | ${endpoint.description}`,
        value: endpoint.id,
        method: endpoint.methodType,
      })) ?? []
    );
  }, [endpoints]);

  const handleChange = useCallback(
    (selectedValue: string) => {
      const endpoint = endpoints?.results?.find((e) => e.id === selectedValue);
      setSelectedEndpoint(endpoint);

      if (props.onChange) {
        props.onChange(selectedValue);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [endpoints?.results, props.onChange],
  );

  useEffect(() => {
    if (endpoints?.results) {
      const foundEndpoint = endpoints.results.find((e) => e.id === value);
      setSelectedEndpoint(foundEndpoint);
    }
  }, [endpoints?.results, value]);

  return (
    <>
      <Select
        label="Endpoint"
        placeholder="The endpoint to call"
        searchable
        clearable
        itemComponent={SelectItem}
        data={selectData}
        icon={
          selectedEndpoint && (
            <Flex>
              <Box
                p={2}
                sx={selectItemStyles(selectedEndpoint.methodType)}
                w={30}
              >
                {selectedEndpoint.methodType}
              </Box>
            </Flex>
          )
        }
        value={value}
        onChange={handleChange}
        {...props}
      />
      {selectedEndpoint?.exampleResponse ? (
        <Group noWrap>
          <EndpointExampleResponsePreview endpoint={selectedEndpoint} />
        </Group>
      ) : null}
    </>
  );
};
