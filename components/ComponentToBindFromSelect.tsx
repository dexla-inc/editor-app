import { ComponentToBindWrapper } from "@/components/ComponentToBindWrapper";
import { AUTOCOMPLETE_OFF_PROPS } from "@/utils/common";
import { ValueProps } from "@/types/dataBinding";
import { Select, SelectProps } from "@mantine/core";
import { useEditorTreeStore } from "@/stores/editorTree";

type Props = Omit<SelectProps, "value" | "onChange" | "label"> & {
  label?: string;
  componentId?: string;
  value: ValueProps;
  onChange: (value: ValueProps) => void;
};

export const ComponentToBindFromSelect = ({
  value,
  onChange,
  data,
  componentId,
  ...rest
}: Props) => {
  const { label, ...restProps } = rest;
  const language = useEditorTreeStore((state) => state.language);
  const _value =
    typeof value?.static === "object"
      ? value?.static?.[language] || value?.static?.default
      : value?.static;

  return (
    <ComponentToBindWrapper
      label={rest?.label}
      value={value}
      onChange={onChange}
    >
      <Select
        style={{ flex: "1" }}
        value={_value}
        size="xs"
        data={data}
        placeholder="Select State"
        nothingFound="Nothing found"
        searchable
        onChange={(e: string) => {
          onChange({
            ...value,
            dataType: "static",
            static: { ...value?.static, [language]: e, default: e },
          });
        }}
        {...restProps}
        {...AUTOCOMPLETE_OFF_PROPS}
      />
    </ComponentToBindWrapper>
  );
};
