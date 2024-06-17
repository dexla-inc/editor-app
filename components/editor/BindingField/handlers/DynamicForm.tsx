import { extractKeys } from "@/utils/data";
import { ActionIcon, Select, Tooltip } from "@mantine/core";
import { useShareableContent } from "@/hooks/data/useShareableContent";
import { useDataBinding } from "@/hooks/data/useDataBinding";
import { useBindingField } from "@/components/editor/BindingField/components/ComponentToBindFromInput";
import { ICON_SIZE } from "@/utils/config";
import React from "react";
import { IconPlug, IconPlugOff } from "@tabler/icons-react";

type DynamicFormFieldsBuilderProps = {
  children: React.ReactNode;
};

export const DynamicForm = ({ children }: DynamicFormFieldsBuilderProps) => {
  const { onChange, value, form, name } = useBindingField();
  const { computeValue } = useDataBinding();
  const { relatedComponentsData } = useShareableContent({ computeValue });
  const parentDataComponent = Object.values(relatedComponentsData).at(-1);
  const dynamicKeysList = extractKeys(parentDataComponent);

  const DataTypeIcon = value?.dataType === "dynamic" ? IconPlugOff : IconPlug;

  const onClickToggleDataType = () => {
    form.setTouched({ [`onLoad.${name}.dataType`]: true });
    onChange({
      ...value,
      dataType: value.dataType === "dynamic" ? "static" : "dynamic",
    });
  };

  return (
    <>
      {value?.dataType === "dynamic" && (
        <Select
          data={extractKeys(parentDataComponent)}
          value={value.dynamic}
          onChange={(val) => onChange({ ...value, dynamic: val })}
          searchable
        />
      )}
      {children}
      {!!dynamicKeysList.length && (
        <Tooltip label="Bind">
          <ActionIcon onClick={() => onClickToggleDataType()} variant="default">
            <DataTypeIcon size={ICON_SIZE} />
          </ActionIcon>
        </Tooltip>
      )}
    </>
  );
};
