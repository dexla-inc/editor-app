import { GRAY_COLOR } from "@/utils/branding";
import { Flex, Text } from "@mantine/core";

type Props = {
  text: string;
  size?: string;
  required?: boolean;
};

export const TopLabel = ({ text, size = "xs", required }: Props) => {
  return (
    <Flex gap={3}>
      <Text
        sx={(theme) =>
          theme.colorScheme === "dark" ? { color: GRAY_COLOR } : {}
        }
        size={size}
        fw={500}
      >
        {text}
      </Text>
      {required && (
        <Text size="xs" color="red">
          *
        </Text>
      )}
    </Flex>
  );
};
