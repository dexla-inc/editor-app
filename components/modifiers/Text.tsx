import { Box, Text } from "@mantine/core";
import { IconTextSize } from "@tabler/icons-react";

export const icon = IconTextSize;
export const label = "Text";

export const Modifier = () => {
  return (
    <Box>
      <Text size="xs">Text Modifier</Text>
    </Box>
  );
};
