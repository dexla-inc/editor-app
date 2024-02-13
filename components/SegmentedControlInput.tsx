import { TopLabel } from "@/components/TopLabel";
import { SegmentedControl, SegmentedControlProps, Stack } from "@mantine/core";

interface Props extends SegmentedControlProps {
  label?: string;
}

export const SegmentedControlInput = ({ label, ...props }: Props) => {
  return (
    <Stack spacing={2}>
      {label && <TopLabel text={label} />}
      <SegmentedControl {...props} />
    </Stack>
  );
};
