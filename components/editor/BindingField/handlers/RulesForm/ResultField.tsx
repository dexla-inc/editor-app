import { ActionIcon, Box, Group } from "@mantine/core";
import { LocationField } from "@/components/editor/BindingField/handlers/RulesForm/LocationField";
import { IconPlugConnected } from "@tabler/icons-react";
import { ICON_SIZE } from "@/utils/config";
import { ComponentToBindField } from "@/components/editor/BindingField/ComponentToBindField";
import { DataType, FieldType, ValueProps } from "@/types/dataBinding";

type ResultFieldProps = {
  value: ValueProps;
  onChange: (val: ValueProps) => void;
  fieldType: FieldType;
};

export const ResultField = ({
  value = {},
  onChange,
  fieldType,
  ...props
}: ResultFieldProps) => {
  const isStaticDataType =
    value?.dataType === undefined || value?.dataType === "static";

  const Field =
    // @ts-ignore
    ComponentToBindField[fieldType] || ComponentToBindField.Text;

  return (
    <Group align="flex-start" w="100%" spacing={5}>
      {isStaticDataType && (
        <Box style={{ flexGrow: 1 }}>
          <Field
            label="Result"
            {...props}
            withAsterisk
            value={value?.static}
            onChange={(val: string) => {
              onChange({ ...value, static: val });
            }}
          />
        </Box>
      )}
      {isStaticDataType || (
        <LocationField
          label="Result"
          value={value?.boundCode!}
          onChange={(val) => {
            onChange({ ...value, boundCode: val });
          }}
        />
      )}
      <ActionIcon
        onClick={() => {
          const dataType = isStaticDataType
            ? DataType.boundCode
            : DataType.static;
          onChange({ ...value, dataType });
        }}
        variant="default"
        tabIndex={-1}
        mt={24}
      >
        <IconPlugConnected size={ICON_SIZE} />
      </ActionIcon>
    </Group>
  );
};
