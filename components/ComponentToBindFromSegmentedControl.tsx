import { ComponentToBindWrapper } from "@/components/ComponentToBindWrapper";
import { DataType, ValueProps } from "@/types/dataBinding";
import { SegmentedControl, SegmentedControlProps, Stack } from "@mantine/core";
import { TopLabel } from "@/components/TopLabel";
import { useEditorTreeStore } from "@/stores/editorTree";
import get from "lodash.get";
import merge from "lodash.merge";

type Props = Omit<SegmentedControlProps, "value" | "onChange" | "label"> & {
  label?: string;
  value: ValueProps;
  onChange: (value: ValueProps) => void;
  isTranslatable?: boolean;
};

export const ComponentToBindFromSegmentedControl = ({
  value,
  onChange,
  isTranslatable = false,
  ...rest
}: Props) => {
  const language = useEditorTreeStore((state) => state.language);
  const staticValue = isTranslatable
    ? value?.static?.[language]
    : value?.static;

  const customOnChange = (fieldValue: any) => {
    const newValue = merge(value, {
      dataType: "static",
      static: isTranslatable ? { [language]: fieldValue } : fieldValue,
    });

    onChange(newValue);
  };

  return (
    <ComponentToBindWrapper
      label={rest?.label}
      value={value}
      onChange={onChange}
    >
      <Stack>
        <SegmentedControl
          value={staticValue}
          size="xs"
          onChange={customOnChange}
          {...rest}
        />
      </Stack>
    </ComponentToBindWrapper>
  );
};
