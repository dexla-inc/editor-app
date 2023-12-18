import { Icon } from "@/components/Icon";
import { Button, ButtonProps, useMantineTheme } from "@mantine/core";
import Link from "next/link";
import { useState } from "react";

type Props = {
  iconName: string;
  text: string;
  href: string;
} & ButtonProps;

export const SettingsButton = ({ iconName, text, href, ...props }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const theme = useMantineTheme();
  const { color, variant } =
    theme.colorScheme === "dark"
      ? { color: "dark", variant: "light" }
      : { color: "dark", variant: "white" };

  return (
    <Button
      size="xs"
      component={Link}
      href={href}
      onClick={() => setIsLoading(true)}
      loading={isLoading}
      leftIcon={<Icon name={iconName} />}
      variant={variant}
      color={color}
      sx={{
        "&:hover": { textDecoration: "underline" },
      }}
      styles={{ inner: { justifyContent: "stretch" } }}
      {...props}
    >
      {text}
    </Button>
  );
};
