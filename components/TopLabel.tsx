import { GRAY_COLOR } from "@/utils/branding";
import { Text } from "@mantine/core";

type Props = {
  text: string;
  size?: string;
};

export const TopLabel = ({ text, size = "xs" }: Props) => {
  return (
    <Text
      sx={(theme) =>
        theme.colorScheme === "dark" ? { color: GRAY_COLOR } : {}
      }
      size={size}
      fw={500}
    >
      {text}
    </Text>
  );
};
