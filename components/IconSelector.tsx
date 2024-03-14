import { IconModal } from "@/components/IconModal";
import { GRAY_COLOR } from "@/utils/branding";
import { ActionIcon, Box, Flex, Text, Tooltip } from "@mantine/core";
import { Icon } from "./Icon";
import { toSpaced } from "@/utils/dashboardTypes";

type Props = {
  topLabel: string;
  selectedIcon: string;
  onIconSelect: (iconName: string) => void;
  onIconDelete?: () => void;
};

export const IconSelector = ({
  topLabel,
  selectedIcon,
  onIconSelect,
  onIconDelete,
}: Props) => {
  return (
    <Box>
      <Text
        sx={(theme) =>
          theme.colorScheme === "dark" ? { color: GRAY_COLOR } : {}
        }
        size="xs"
        fw={500}
      >
        {topLabel}
      </Text>
      <Flex gap="md" align="center" justify="space-between">
        <>
          <IconModal onIconSelect={onIconSelect} />
          <Tooltip label={toSpaced(selectedIcon)}>
            <Icon name={selectedIcon} />
          </Tooltip>
        </>
        {selectedIcon && (
          <Tooltip label="Delete">
            <ActionIcon onClick={onIconDelete}>
              <Icon name="IconX" />
            </ActionIcon>
          </Tooltip>
        )}
      </Flex>
    </Box>
  );
};
