import { TopLabel } from "@/components/TopLabel";
import {
  Flex,
  SegmentedControl,
  SegmentedControlProps,
  Stack,
} from "@mantine/core";

interface Props extends SegmentedControlProps {
  label?: string;
}

export const SegmentedControlInput = ({ label, ...props }: Props) => {
  return (
    <Flex gap={2} direction="column" style={{ flexGrow: 1 }}>
      {label && <TopLabel text={label} />}
      <SegmentedControl {...props} />
    </Flex>
  );
};
