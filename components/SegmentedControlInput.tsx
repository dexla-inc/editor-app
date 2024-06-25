import { TopLabel } from "@/components/TopLabel";
import {
  Flex,
  SegmentedControl,
  SegmentedControlProps,
  Stack,
  Text,
} from "@mantine/core";

interface Props extends SegmentedControlProps {
  label?: string;
  description?: string;
  withAsterisk?: boolean;
}

export const SegmentedControlInput = ({
  label,
  description,
  ...props
}: Props) => {
  return (
    <Flex gap={2} direction="column" style={{ flexGrow: 1 }}>
      {label && <TopLabel text={label} required={props.withAsterisk} />}
      {description && (
        <Text size={10} color="dimmed">
          {description}
        </Text>
      )}
      <SegmentedControl {...props} />
    </Flex>
  );
};
