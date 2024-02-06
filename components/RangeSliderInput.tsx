import { TopLabel } from "@/components/TopLabel";
import { RangeSlider, RangeSliderProps, Stack } from "@mantine/core";

interface Props extends RangeSliderProps {
  label: string;
}

export const RangeSliderInput = ({ label, ...props }: Props) => {
  return (
    <Stack spacing={2}>
      <TopLabel text={label} />
      <RangeSlider {...props} />
    </Stack>
  );
};
