import { DashboardNavLink } from "@/components/DashboardNavLink";
import { Stack, Text } from "@mantine/core";
import { useRouter } from "next/router";

export const DashboardNavLinks = () => {
  const router = useRouter();

  return (
    <Stack>
      <Text size="xs" color="dimmed" px="md">
        Work
      </Text>
      <DashboardNavLink
        label="Projects"
        icon="IconPresentation"
        pathName="/projects"
      />
      <Stack py="xl" spacing="xs">
        <Text size="xs" color="dimmed" px="md">
          Settings
        </Text>
        <DashboardNavLink label="Team" icon="IconUser" pathName="/team" />
        <DashboardNavLink
          label="General"
          icon="IconBuildingSkyscraper"
          pathName="/company"
          disabled
        />
        <DashboardNavLink
          label="Plans"
          icon="IconBusinessplan"
          pathName="/plans"
          disabled
        />
        <DashboardNavLink
          label="Billing"
          icon="IconCreditCard"
          pathName="/billing"
          disabled
        />
        <DashboardNavLink
          label="Apps & Integrations"
          icon="IconApps"
          pathName="/apps"
          disabled
        />
      </Stack>
    </Stack>
  );
};
