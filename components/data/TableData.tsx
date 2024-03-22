import { DynamicSettings } from "@/components/data/forms/DynamicSettings";
import { useEditorTreeStore } from "@/stores/editorTree";
import {
  Box,
  NumberInput,
  SegmentedControl,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { TableForm } from "./forms/static/TableForm";
import { DataProps } from "@/components/data/type";

export const TableData = ({ component, endpoints, dataType }: DataProps) => {
  const updateTreeComponentAttrs = useEditorTreeStore(
    (state) => state.updateTreeComponentAttrs,
  );

  return (
    <Stack>
      <SegmentedControl
        w="100%"
        size="xs"
        value={component.props?.dataType}
        data={[
          { label: "Static", value: "static" },
          { label: "Dynamic", value: "dynamic" },
        ]}
        onChange={(e) =>
          updateTreeComponentAttrs({
            componentIds: [component.id!],
            attrs: { props: { dataType: e } },
          })
        }
      />
      {dataType === "static" && <TableForm component={component} />}
      {dataType === "dynamic" && (
        <DynamicSettings
          component={component}
          endpoints={endpoints!}
          customProps={{
            columnCount: 5,
          }}
        >
          {({ form, selectableObjectKeys }) => {
            return (
              <Stack spacing="xs" my="xs">
                <Box>
                  <Title order={6} mt="xs">
                    Options
                  </Title>
                  <Text size="xs" color="dimmed">
                    Configure the table
                  </Text>
                </Box>

                <NumberInput
                  label="Column count"
                  data={selectableObjectKeys}
                  min={1}
                  {...form.getInputProps("columnCount")}
                />
              </Stack>
            );
          }}
        </DynamicSettings>
      )}
    </Stack>
  );
};
