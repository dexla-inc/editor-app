import { IconModal } from "@/components/IconModal";
import { ActionIcon, Box, Flex, Text, Tooltip } from "@mantine/core";
import { Icon } from "./Icon";

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
      <Flex gap="md" align="center" justify="space-between">
        <>
          <IconModal onIconSelect={onIconSelect} />
          <Icon name={selectedIcon} />
        </>
        {selectedIcon && (
          <Tooltip label="Delete" withArrow fz="xs">
            <ActionIcon onClick={() => onIconSelect("X")}>
              <Icon name="IconX" />
            </ActionIcon>
          </Tooltip>
        )}
      </Flex>
    </Box>
  );
};
