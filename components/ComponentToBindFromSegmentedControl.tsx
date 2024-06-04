import { ComponentToBindWrapper } from "@/components/ComponentToBindWrapper";
import { ValueProps } from "@/types/dataBinding";
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
  const fetchedValue = get(value?.static, language, value?.static);

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
          value={fetchedValue}
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
