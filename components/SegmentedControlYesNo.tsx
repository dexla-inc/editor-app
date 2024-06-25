import { TopLabel } from "@/components/TopLabel";
import {
  SegmentedControl,
  SegmentedControlProps,
  Stack,
  Text,
} from "@mantine/core";

interface Props
  extends Omit<SegmentedControlProps, "data" | "onChange" | "value"> {
  label?: string;
  description?: string;
  value?: boolean | string;
  useTrueOrFalseStrings?: boolean;
  onChange?: (value: boolean) => void;
}

export const SegmentedControlYesNo = ({
  label,
  description,
  value,
  onChange,
  useTrueOrFalseStrings = false,
  ...props
}: Props) => {
  const stringValue = value || value === "" ? "true" : "false";

  const handleChange = (val: string) => {
    onChange?.(val === "true");
  };

  const options = {
    true: useTrueOrFalseStrings ? "True" : "Yes",
    false: useTrueOrFalseStrings ? "False" : "No",
  };

  const data = [
    { label: options.true, value: "true" },
    { label: options.false, value: "false" },
  ];

  return (
    <Stack spacing={2} w="100%">
      <TopLabel text={label!} />
      {description && (
        <Text size={10} color="dimmed">
          {description}
        </Text>
      )}
      <SegmentedControl
        data={data}
        value={stringValue}
        onChange={handleChange}
        {...props}
      />
    </Stack>
  );
};
