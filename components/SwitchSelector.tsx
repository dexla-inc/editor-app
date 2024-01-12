import { GRAY_COLOR } from "@/utils/branding";
import { Box, Switch, SwitchProps, Text } from "@mantine/core";

interface SwitchSelectorProps extends SwitchProps {
  topLabel: string;
  checked?: boolean;
}

export const SwitchSelector = ({ topLabel, ...props }: SwitchSelectorProps) => {
  return (
    <Box>
      <Text
        sx={(theme) =>
          theme.colorScheme === "dark" ? { color: GRAY_COLOR } : {}
        }
        size="xs"
        fw={500}
        pb={2}
      >
        {topLabel}
      </Text>
      <Switch {...props} />
    </Box>
  );
};
