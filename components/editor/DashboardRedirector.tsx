import AIPromptTextInput from "@/components/AIPromptTextInput";
import { Logo } from "@/components/Logo";
import { OtherAvatars } from "@/components/OtherAvatars";
import { Group, Tooltip } from "@mantine/core";
import Link from "next/link";
import { useProjectQuery } from "@/hooks/editor/reactQuery/useProjectQuery";

type Props = {
  projectId: string;
};

const DashboardRedirector = ({ projectId }: Props) => {
  const { data: project } = useProjectQuery(projectId);

  return (
    <Group>
      <Tooltip withinPortal label={`Back to dashboard | ${project?.name}`}>
        <Link href="/projects" passHref>
          <Logo />
        </Link>
      </Tooltip>
      {/* <AIPromptTextInput /> */}
      <OtherAvatars />
    </Group>
  );
};

export default DashboardRedirector;
