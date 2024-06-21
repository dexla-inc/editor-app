import { ActionIcon, Group } from "@mantine/core";
import { LocationField } from "@/components/editor/BindingField/handlers/RulesForm/LocationField";
import { IconPlugConnected } from "@tabler/icons-react";
import { ICON_SIZE } from "@/utils/config";
import { ComponentToBindField } from "@/components/editor/BindingField/ComponentToBindField";
import { ValueProps } from "@/types/dataBinding";

type ResultFieldProps = {
  value: ValueProps;
  onChange: (val: ValueProps) => void;
};

export const ResultField = (props: ResultFieldProps) => {
  const isStaticDataType =
    props.value.dataType === undefined || props.value.dataType === "static";

  const Field =
    // @ts-ignore
    ComponentToBindField[props.fieldType] || ComponentToBindField.Text;

  return (
    <Group align="flex-start" w="100%" spacing={5}>
      {isStaticDataType && (
        <Field
          withAsterisk
          label="Result"
          style={{ flexGrow: 1 }}
          {...props}
          value={props.value.static}
          onChange={(val: string) => {
            props.onChange({ ...props.value, static: val });
          }}
        />
      )}
      {isStaticDataType || (
        <LocationField
          label="Result"
          value={props.value.boundCode!}
          onChange={(val) => {
            props.onChange({ ...props.value, boundCode: val });
          }}
        />
      )}
      <ActionIcon
        onClick={() => {
          const dataType = isStaticDataType ? "boundCode" : "static";
          props.onChange({ ...props.value, dataType });
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
