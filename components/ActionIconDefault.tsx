import { Icon } from "@/components/Icon";
import { ActionIcon, ActionIconProps, Tooltip } from "@mantine/core";
import Link from "next/link";
import { memo, MouseEventHandler } from "react";

type BaseProps = {
  iconName: string;
  tooltip?: string;
  color?: "white" | "indigo" | "teal" | "red";
  id?: string;
} & ActionIconProps;

type ClickProps = {
  onClick: MouseEventHandler<HTMLButtonElement>;
  href?: never;
};

type LinkProps = {
  onClick?: never;
  href: string;
};

type Props = BaseProps & (ClickProps | LinkProps);

export const ActionIconDefaultComponent = ({
  iconName,
  tooltip,
  onClick,
  href,
  color = "white",
  id,
  ...props
}: Props) => {
  return (
    <Tooltip label={tooltip} withArrow disabled={!tooltip}>
      {href ? (
        <ActionIcon
          id={id}
          component={Link}
          href={href}
          variant={color === "white" ? "default" : "light"}
          color={color}
          {...props}
        >
          <Icon name={iconName} />
        </ActionIcon>
      ) : (
        <ActionIcon
          id={id}
          onClick={onClick}
          variant={color === "white" ? "default" : "light"}
          color={color}
          {...props}
        >
          <Icon name={iconName} />
        </ActionIcon>
      )}
    </Tooltip>
  );
};

export const ActionIconDefault = memo(ActionIconDefaultComponent);
