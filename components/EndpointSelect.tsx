import { colors } from "@/components/datasources/DataSourceEndpoint";
import { useDataSourceEndpoints } from "@/hooks/reactQuery/useDataSourceEndpoints";
import { Endpoint } from "@/requests/datasources/types";
import { MethodTypes } from "@/requests/types";
import { useDataSourceStore } from "@/stores/datasource";
import { useEditorStore } from "@/stores/editor";
import { Box, Flex, Select, SelectProps, Text } from "@mantine/core";
import { forwardRef, useEffect, useState } from "react";
import { EndpointExampleResponsePreview } from "./EndpointExampleResponsePreview";

const SelectItem = forwardRef<HTMLDivElement, any>(
  ({ method, label, ...others }: any, ref) => (
    <Flex ref={ref} gap="xs" {...others}>
      <Box
        p={2}
        sx={{
          fontSize: 8,
          color: "white",
          border: colors[method as MethodTypes].color + " 1px solid",
          background: colors[method as MethodTypes].color,
          borderRadius: "4px",
          width: 38,
          textAlign: "center",
        }}
      >
        {method}
      </Box>
      <Text size="xs" truncate>
        {label}
      </Text>
    </Flex>
  ),
);

SelectItem.displayName = "EndpointSelectItem";
type Props = {
  value?: string;
} & Omit<SelectProps, "data">;

export const EndpointSelect = ({ value, ...props }: Props) => {
  const setApiAuthConfig = useDataSourceStore(
    (state) => state.setApiAuthConfig,
  );
  const projectId = useEditorStore((state) => state.currentProjectId);
  const { data: endpoints } = useDataSourceEndpoints(projectId);
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint>();

  useEffect(() => {
    if (endpoints?.results) {
      setApiAuthConfig(endpoints.results);
      const selectedEndpoint = endpoints.results.find((e) => e.id === value);

      setSelectedEndpoint(selectedEndpoint);
    }
  }, [endpoints?.results]);

  return (
    <>
      <Select
        label="Endpoint"
        placeholder="The endpoint to call"
        searchable
        clearable
        itemComponent={SelectItem}
        data={
          endpoints?.results?.map((endpoint) => {
            return {
              label: endpoint.relativeUrl,
              value: endpoint.id,
              method: endpoint.methodType,
            };
          }) ?? []
        }
        icon={
          <Flex>
            <Box
              p={2}
              sx={{
                fontSize: 8,
                color: "white",
                border:
                  selectedEndpoint?.methodType &&
                  colors[selectedEndpoint.methodType].color + " 1px solid",
                background:
                  selectedEndpoint?.methodType &&
                  colors[selectedEndpoint.methodType].color,
                borderRadius: "4px",
                width: 28,
                textAlign: "center",
              }}
            >
              {selectedEndpoint?.methodType}
            </Box>
          </Flex>
        }
        value={value}
        {...props}
      />
      {selectedEndpoint?.exampleResponse ? (
        <EndpointExampleResponsePreview endpoint={selectedEndpoint} />
      ) : null}
    </>
  );
};
