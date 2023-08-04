import { IconModal } from "@/components/IconModal";
import { Box, Flex, Text } from "@mantine/core";

type Props = {
  topLabel: string;
  selectedIcon: string;
  onIconSelect: (iconName: string) => void;
};

export const IconSelector = ({
  topLabel,
  selectedIcon,
  onIconSelect,
}: Props) => {
  return (
    <Box>
      <Text size="xs" fw={500}>
        {topLabel}
      </Text>
      <Flex gap="md">
        <IconModal onIconSelect={onIconSelect} />
        {/* <Icon name={selectedIcon} /> */}
      </Flex>
    </Box>
  );
};
