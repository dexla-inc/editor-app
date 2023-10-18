import { ActionIcon, Tooltip } from "@mantine/core";
import Link from "next/link";
import { Icon } from "../Icon";

type Props = {
  pageId: string;
  projectId: string;
};

export const LogicFlowButton = ({ projectId, pageId }: Props) => {
  return (
    <Tooltip label="Logic Flows" withArrow fz="xs">
      <ActionIcon
        component={Link}
        href={`/projects/${projectId}/editor/${pageId}/flows`}
        variant="default"
      >
        <Icon name="IconLogicBuffer" />
      </ActionIcon>
    </Tooltip>
  );
};
