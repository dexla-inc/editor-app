import { Icon } from "@/components/Icon";
import { ICON_SIZE } from "@/utils/config";
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
          icon={<Icon name="IconSettings" size={ICON_SIZE} />}
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
          icon={<Icon name="IconDatabase" size={ICON_SIZE} />}
          px="xl"
        >
          Data Sources
        </Tabs.Tab>
      </Link>
      <Link
        href={`/projects/${id}/settings/team?name=${name}`}
        style={{ textDecoration: "none" }}
      >
        <Tabs.Tab
          value="team"
          icon={<Icon name="IconUsers" size={ICON_SIZE} />}
          px="xl"
        >
          Team
        </Tabs.Tab>
      </Link>
      <Link
        href={`/projects/${id}/settings/domain?name=${name}`}
        style={{ textDecoration: "none" }}
      >
        <Tabs.Tab
          value="domain"
          icon={<Icon name="IconWorldWww" size={ICON_SIZE} />}
          px="xl"
        >
          Domain
        </Tabs.Tab>
      </Link>
      <Link
        href={`/projects/${id}/settings/typography?name=${name}`}
        style={{ textDecoration: "none" }}
      >
        <Tabs.Tab
          value="typography"
          icon={<Icon name="IconWorldWww" size={ICON_SIZE} />}
          px="xl"
        >
          Typography
        </Tabs.Tab>
      </Link>
      <Link
        href={`/projects/${id}/settings/colours?name=${name}`}
        style={{ textDecoration: "none" }}
      >
        <Tabs.Tab
          value="colours"
          icon={<Icon name="IconWorldWww" size={ICON_SIZE} />}
          px="xl"
        >
          Colours
        </Tabs.Tab>
      </Link>
    </Tabs.List>
  );
};
