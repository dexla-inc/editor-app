import AIPromptTextInput from "@/components/AIPromptTextInput";
import { Logo } from "@/components/Logo";
import { OtherAvatars } from "@/components/OtherAvatars";
import { Group, Tooltip } from "@mantine/core";
import Link from "next/link";

const DashboardRedirector = () => {
  return (
    <Group>
      <Tooltip withinPortal label="Back to dashboard">
        <Link href="/projects" passHref>
          <Logo />
        </Link>
      </Tooltip>
      <AIPromptTextInput />
      <OtherAvatars />
    </Group>
  );
};

export default DashboardRedirector;
