import { ActionIcon, Tooltip } from "@mantine/core";
import Link from "next/link";
import { MouseEventHandler } from "react";
import { Icon } from "./Icon";

type BaseProps = {
  iconName: string;
  tooltip: string;
  color?: "white" | "indigo";
};

type ClickProps = {
  onClick: MouseEventHandler<HTMLButtonElement>;
  href?: never;
};

type LinkProps = {
  onClick?: never;
  href: string;
};

type Props = BaseProps & (ClickProps | LinkProps);

export const ActionIconDefault = ({
  iconName,
  tooltip,
  onClick,
  href,
  color = "white",
}: Props) => {
  return (
    <Tooltip label={tooltip} withArrow fz="xs">
      {href ? (
        <ActionIcon
          component={Link}
          href={href}
          variant={color === "white" ? "default" : "light"}
          color={color}
        >
          <Icon name={iconName} />
        </ActionIcon>
      ) : (
        <ActionIcon
          onClick={onClick}
          variant={color === "white" ? "default" : "light"}
          color={color}
        >
          <Icon name={iconName} />
        </ActionIcon>
      )}
    </Tooltip>
  );
};
