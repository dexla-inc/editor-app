import AIPromptTextInput from "@/components/AIPromptTextInput";
import { Logo } from "@/components/Logo";
import { OtherAvatars } from "@/components/OtherAvatars";
import { useTemporalStore } from "@/stores/editor";
import { Group, Tooltip } from "@mantine/core";
import Link from "next/link";

const DashboardRedirector = () => {
  const clear = useTemporalStore((state) => state.clear);

  return (
    <Group>
      <Tooltip withinPortal label="Back to dashboard">
        {/* Ensure the onClick handler calls clear before redirecting */}
        <Link href="/projects" onClick={() => clear()} passHref>
          <Logo />
        </Link>
      </Tooltip>
      <AIPromptTextInput />
      <OtherAvatars />
    </Group>
  );
};

export default DashboardRedirector;
