import { TopLabel } from "@/components/TopLabel";
import { SegmentedControl, SegmentedControlProps, Stack } from "@mantine/core";

interface Props extends Omit<SegmentedControlProps, "data"> {
  label: string;
}

export const SegmentedControlYesNo = ({ label, ...props }: Props) => {
  return (
    <Stack spacing={2}>
      <TopLabel text={label} />
      <SegmentedControl
        data={[
          {
            label: "Yes",
            value: "true",
          },
          {
            label: "No",
            value: "false",
          },
        ]}
        {...props}
      />
    </Stack>
  );
};
