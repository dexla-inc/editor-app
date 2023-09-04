import { Icon } from "@/components/Icon";
import { Tabs } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";

export const SettingsTabs = () => {
  const router = useRouter();
  const { id, name } = router.query as { id: string; name: string };

  return (
    <Tabs.List>
      <Link
        href={`/projects/${id}/settings?name=${name}`}
        style={{ textDecoration: "none" }}
      >
        <Tabs.Tab
          value="general"
          icon={<Icon name="IconSettings" size="0.8rem" />}
          px="xl"
        >
          General
        </Tabs.Tab>
      </Link>
      <Link
        href={`/projects/${id}/settings/datasources?name=${name}`}
        style={{ textDecoration: "none" }}
      >
        <Tabs.Tab
          value="datasources"
          icon={<Icon name="IconDatabase" size="0.8rem" />}
          px="xl"
        >
          Data Sources
        </Tabs.Tab>
      </Link>
      <Link
        href={`/projects/${id}/settings/users?name=${name}`}
        style={{ textDecoration: "none" }}
      >
        <Tabs.Tab
          value="team"
          icon={<Icon name="IconUsers" size="0.8rem" />}
          px="xl"
        >
          Team
        </Tabs.Tab>
      </Link>
      <Tabs.Tab
        value="domain"
        icon={<Icon name="IconWorldWww" size="0.8rem" />}
        px="xl"
        disabled
      >
        Domain
      </Tabs.Tab>
    </Tabs.List>
  );
};
