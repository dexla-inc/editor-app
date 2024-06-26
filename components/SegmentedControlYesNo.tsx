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
  value?: boolean;
  useTrueOrFalseStrings?: boolean;
  onChange?: (value: boolean) => void;
  withAsterisk?: boolean;
}

export const SegmentedControlYesNo = ({
  label,
  description,
  value,
  onChange,
  useTrueOrFalseStrings = false,
  withAsterisk = false,
  ...props
}: Props) => {
  const stringValue = value ? "true" : "false";

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
  console.log({ stringValue }, value);
  return (
    // WARNING: do not remove the mt property, it will break RulesForm design
    <Stack spacing={2} w="100%" mt={4}>
      <TopLabel text={label!} required={withAsterisk} />
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
