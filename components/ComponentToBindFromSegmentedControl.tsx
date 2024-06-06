import { ComponentToBindWrapper } from "@/components/ComponentToBindWrapper";
import { DataType, ValueProps } from "@/types/dataBinding";
import { SegmentedControl, SegmentedControlProps, Stack } from "@mantine/core";
import { TopLabel } from "@/components/TopLabel";
import { useEditorTreeStore } from "@/stores/editorTree";
import get from "lodash.get";

type Props = Omit<SegmentedControlProps, "value" | "onChange" | "label"> & {
  label?: string;
  value: ValueProps;
  onChange: (value: ValueProps) => void;
};

export const ComponentToBindFromSegmentedControl = ({
  value,
  onChange,
  ...rest
}: Props) => {
  const language = useEditorTreeStore((state) => state.language);
  const staticValue = get(value?.static, language, value?.static);

  const onChangeStatic = (fieldValue: any) => {
    const newValue = {
      ...value,
      dataType: "static" as DataType,
      static: { [language]: fieldValue },
    };

    if (language !== "en" && typeof value?.static === "string") {
      newValue.static = {
        en: value?.static,
      };
    }

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
          onChange={onChangeStatic}
          {...rest}
        />
      </Stack>
    </ComponentToBindWrapper>
  );
};
