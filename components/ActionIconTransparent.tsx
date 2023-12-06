import { Icon } from "@/components/Icon";
import { ActionIcon, Tooltip } from "@mantine/core";
import { MouseEventHandler } from "react";

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
