import { ComponentToBindWrapper } from "@/components/ComponentToBindWrapper";
import { AUTOCOMPLETE_OFF_PROPS } from "@/utils/common";
import { DataType, ValueProps } from "@/types/dataBinding";
import { Select, SelectProps } from "@mantine/core";
import { useEditorTreeStore } from "@/stores/editorTree";
import get from "lodash.get";

type Props = Omit<SelectProps, "value" | "onChange" | "label"> & {
  label?: string;
  componentId?: string;
  value: ValueProps;
  onChange: (value: ValueProps) => void;
  isTranslatable?: boolean;
};

export const ComponentToBindFromSelect = ({
  value,
  onChange,
  data,
  componentId,
  isTranslatable = false,
  ...rest
}: Props) => {
  const { label, ...restProps } = rest;
  const language = useEditorTreeStore((state) => state.language);
  const staticValue = isTranslatable
    ? value?.static?.[language]
    : value?.static;

  const customOnChange = (val: any) => {
    const newValue = {
      ...value,
      dataType: "static" as DataType,
      static: isTranslatable ? { [language]: val } : val,
    };
    onChange(newValue);
  };

  return (
    <ComponentToBindWrapper
      label={rest?.label}
      value={value}
      onChange={onChange}
    >
      <Select
        style={{ flex: "1" }}
        value={staticValue}
        size="xs"
        data={data}
        placeholder="Select State"
        nothingFound="Nothing found"
        searchable
        onChange={customOnChange}
        {...restProps}
        {...AUTOCOMPLETE_OFF_PROPS}
      />
    </ComponentToBindWrapper>
  );
};
