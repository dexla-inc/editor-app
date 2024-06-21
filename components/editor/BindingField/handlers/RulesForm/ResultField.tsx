import { ActionIcon, Group } from "@mantine/core";
import { LocationField } from "@/components/editor/BindingField/handlers/RulesForm/LocationField";
import { IconPlugConnected } from "@tabler/icons-react";
import { ICON_SIZE } from "@/utils/config";
import { ComponentToBindField } from "@/components/editor/BindingField/ComponentToBindField";
import { FieldType, ValueProps } from "@/types/dataBinding";

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
    ComponentToBindField[props.fieldType] || ComponentToBindField.Text;

  return (
    <Group align="flex-start" w="100%" spacing={5}>
      {isStaticDataType && (
        <Field
          label="Result"
          withAsterisk
          style={{ flexGrow: 1 }}
          {...props}
          value={value?.static}
          onChange={(val: string) => {
            onChange({ ...value, static: val });
          }}
        />
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
          const dataType = isStaticDataType ? "boundCode" : "static";
          onChange({ ...value, dataType });
        }}
        variant="default"
        tabIndex={-1}
        mt={25}
      >
        <IconPlugConnected size={ICON_SIZE} />
      </ActionIcon>
    </Group>
  );
};
