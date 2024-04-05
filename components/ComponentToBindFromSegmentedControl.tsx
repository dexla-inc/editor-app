import { ComponentToBindWrapper } from "@/components/ComponentToBindWrapper";
import { ValueProps } from "@/types/dataBinding";
import { SegmentedControl, SegmentedControlProps, Stack } from "@mantine/core";
import { TopLabel } from "@/components/TopLabel";

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
  return (
    <ComponentToBindWrapper
      label={rest?.label}
      value={value}
      onChange={onChange}
    >
      <Stack>
        <TopLabel text={rest?.label!} />
        <SegmentedControl
          value={value?.static}
          size="xs"
          onChange={(e: string) =>
            onChange({ ...value, dataType: "static", static: e })
          }
          {...rest}
        />
      </Stack>
    </ComponentToBindWrapper>
  );
};
