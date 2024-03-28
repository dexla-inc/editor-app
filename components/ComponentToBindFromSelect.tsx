import { ComponentToBindWrapper } from "@/components/ComponentToBindWrapper";
import { AUTOCOMPLETE_OFF_PROPS } from "@/utils/common";
import { ValueProps } from "@/types/dataBinding";
import { Select, SelectProps } from "@mantine/core";

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
  return (
    <ComponentToBindWrapper
      label={rest?.label}
      value={value}
      onChange={onChange}
    >
      <Select
        style={{ flex: "1" }}
        value={value?.static}
        size="xs"
        data={data}
        placeholder="Select State"
        nothingFound="Nothing found"
        searchable
        onChange={(e: string) => {
          onChange({ ...value, dataType: "static", static: e });
        }}
        {...rest}
        {...AUTOCOMPLETE_OFF_PROPS}
      />
    </ComponentToBindWrapper>
  );
};
