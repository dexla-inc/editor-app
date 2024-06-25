import { ActionIcon, Group, MultiSelect, TextInput } from "@mantine/core";
import { IconPlugConnected } from "@tabler/icons-react";
import { ICON_SIZE } from "@/utils/config";
import { LocationField } from "@/components/editor/BindingField/handlers/RulesForm/LocationField";
import { DataType, ValueProps } from "@/types/dataBinding";

type ValueField = {
  value: ValueProps;
  onChange: (val: ValueProps) => void;
  placeholder: string;
  isMultiple: boolean;
  isSingle: boolean;
};

export const ValueField = ({
  placeholder,
  isMultiple,
  isSingle,
  onChange,
  value,
}: ValueField) => {
  const isStaticDataType =
    value?.dataType === undefined || value?.dataType === "static";

  return (
    <Group align="flex-start" w="100%" spacing={5}>
      {isStaticDataType && (
        <>
          {isSingle && (
            <TextInput
              withAsterisk
              label="Value"
              placeholder={placeholder}
              value={value?.static}
              onChange={(e) => {
                onChange({ ...value, static: e.target.value });
              }}
              style={{ flexGrow: 1 }}
              size="xs"
            />
          )}
          {isMultiple && (
            <MultiSelect
              label="Value"
              placeholder={placeholder}
              data={(value?.static as string[]) ?? []}
              searchable
              creatable
              withAsterisk
              getCreateLabel={(query) => `+ Create ${query}`}
              onChange={(val) => {
                onChange({ ...value, static: val });
              }}
              onCreate={(query) => {
                const item = { value: query, label: query };
                onChange({
                  ...value,
                  static: [...(value?.static ?? []), item],
                });
                return item;
              }}
              style={{ flexGrow: 1 }}
              size="xs"
            />
          )}
        </>
      )}
      {isStaticDataType || (
        <LocationField
          label="Value"
          value={value?.boundCode!}
          onChange={(val) => {
            onChange({ ...value, boundCode: val });
          }}
        />
      )}
      {(isSingle || isMultiple) && (
        <ActionIcon
          onClick={() => {
            const dataType = isStaticDataType
              ? DataType.boundCode
              : DataType.static;
            onChange({ ...value, dataType });
          }}
          variant="default"
          tabIndex={-1}
          mt={25}
        >
          <IconPlugConnected size={ICON_SIZE} />
        </ActionIcon>
      )}
    </Group>
  );
};
