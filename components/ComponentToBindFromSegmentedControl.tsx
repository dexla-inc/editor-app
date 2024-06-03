import { ComponentToBindWrapper } from "@/components/ComponentToBindWrapper";
import { ValueProps } from "@/types/dataBinding";
import { SegmentedControl, SegmentedControlProps, Stack } from "@mantine/core";
import { TopLabel } from "@/components/TopLabel";
import { useEditorTreeStore } from "@/stores/editorTree";

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
  const _value =
    typeof value?.static === "object"
      ? value?.static?.[language] || value?.static?.default
      : value?.static;

  const onChangeStatic = (val: any) => {
    onChange({
      ...value,
      dataType: "static",
      static: { ...value?.static, [language]: val, default: val },
    });
  };
  return (
    <ComponentToBindWrapper
      label={rest?.label}
      value={value}
      onChange={onChange}
    >
      <Stack>
        <SegmentedControl
          value={_value}
          size="xs"
          onChange={(e: string) =>
            onChange({
              ...value,
              dataType: "static",
              static: { ...value?.static, [language]: e, default: e },
            })
          }
          {...rest}
        />
      </Stack>
    </ComponentToBindWrapper>
  );
};
