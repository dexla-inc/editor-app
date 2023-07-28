import { Box, Switch, SwitchProps, Text } from "@mantine/core";

interface SwitchSelectorProps extends SwitchProps {
  topLabel: string;
}

export const SwitchSelector = ({ topLabel, ...props }: SwitchSelectorProps) => {
  return (
    <Box>
      <Text size="xs" fw={500}>
        {topLabel}
      </Text>
      <Switch {...props} />
    </Box>
  );
};
