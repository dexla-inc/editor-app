import { TopLabel } from "@/components/TopLabel";
import { SegmentedControl, SegmentedControlProps, Stack } from "@mantine/core";

interface Props
  extends Omit<SegmentedControlProps, "data" | "onChange" | "value"> {
  label: string;
  value?: boolean;
  onChange?: (value: boolean) => void;
}

export const SegmentedControlYesNo = ({
  label,
  value,
  onChange,
  ...props
}: Props) => {
  const stringValue = value ? "true" : "false";

  const handleChange = (val: string) => {
    onChange?.(val === "true");
  };

  return (
    <Stack spacing={2}>
      <TopLabel text={label} />
      <SegmentedControl
        data={[
          { label: "Yes", value: "true" },
          { label: "No", value: "false" },
        ]}
        value={stringValue}
        onChange={handleChange}
        {...props}
      />
    </Stack>
  );
};
