import { Button } from "@mantine/core";
import Link from "next/link";

type Props = {
  pageId: string;
  projectId: string;
};

export const LogicFlowButton = ({ projectId, pageId }: Props) => {
  return (
    <Button
      component={Link}
      variant="default"
      href={`/projects/${projectId}/editor/${pageId}/flow`}
    >
      Logic flow
    </Button>
  );
};
