import { ActionIcon, Tooltip } from "@mantine/core";
import { MouseEventHandler } from "react";
import { Icon } from "./Icon";

type Props = {
  iconName: string;
  tooltip: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

export const ActionIconTransparent = ({
  iconName,
  tooltip,
  onClick,
}: Props) => {
  return (
    <Tooltip label={tooltip} withArrow fz="xs">
      <ActionIcon onClick={onClick} variant="transparent">
        <Icon name={iconName} color="white" />
      </ActionIcon>
    </Tooltip>
  );
};
