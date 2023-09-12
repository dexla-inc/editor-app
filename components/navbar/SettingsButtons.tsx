import { Icon } from "@/components/Icon";
import { Button, ButtonProps } from "@mantine/core";
import Link from "next/link";
import { useState } from "react";

type Props = {
  iconName: string;
  text: string;
  href: string;
} & ButtonProps;

export const SettingsButton = ({ iconName, text, href, ...props }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Button
      size="xs"
      component={Link}
      href={href}
      onClick={() => setIsLoading(true)}
      loading={isLoading}
      leftIcon={<Icon name={iconName} />}
      variant="white"
      color="dark"
      sx={{ "&:hover": { textDecoration: "underline" } }}
      {...props}
    >
      {text}
    </Button>
  );
};
