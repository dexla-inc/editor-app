import { GRAY_COLOR } from "@/utils/branding";
import { Flex, FlexProps, Text } from "@mantine/core";

type Props = {
  text: string;
  size?: string;
  required?: boolean;
} & FlexProps;

export const TopLabel = ({ text, size = "xs", required, ...rest }: Props) => {
  return (
    <Flex gap={3} maw={200} {...rest}>
      <Text
        sx={(theme) =>
          theme.colorScheme === "dark" ? { color: GRAY_COLOR } : {}
        }
        size={size}
        fw={500}
        truncate
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
