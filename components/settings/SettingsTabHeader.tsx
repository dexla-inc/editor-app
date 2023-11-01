import { Icon } from "@/components/Icon";
import { ICON_SIZE } from "@/utils/config";
import { Button, Flex, Title } from "@mantine/core";
import Link from "next/link";

export const SettingsTabHeader = ({ name }: { name: string }) => {
  return (
    <Flex gap="md" align="center">
      <Button
        component={Link}
        href="/projects"
        variant="subtle"
        leftIcon={<Icon name="IconArrowLeft" size={ICON_SIZE} stroke={1.5} />}
        m={10}
        compact
      >
        Back
      </Button>
      {name && name !== "undefined" && <Title order={3}>{name}</Title>}
    </Flex>
  );
};
