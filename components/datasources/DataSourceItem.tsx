import { buttonHoverStyles } from "@/components/styles/buttonHoverStyles";
import { deleteDataSource } from "@/requests/datasources/mutations";
import { DataSourceResponse } from "@/requests/datasources/types";
import { ICON_SIZE, LARGE_ICON_SIZE } from "@/utils/config";
import {
  Box,
  Col,
  Flex,
  Group,
  MantineTheme,
  Menu,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { IconDots, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/router";

type DataSourceItemProps = {
  datasource: DataSourceResponse;
  theme: MantineTheme;
  onDelete: (id: string) => void;
};

export function DataSourceItem({
  datasource,
  theme,
  onDelete,
}: DataSourceItemProps) {
  const router = useRouter();
  const projectId = router.query.id as string;

  const deleteFn = async () => {
    await deleteDataSource(projectId, datasource.id);
    onDelete(datasource.id);
  };

  return (
    <Col lg={4} md={6} xs={12}>
      <Box
        sx={{
          borderRadius: theme.radius.sm,
          border: "1px solid " + theme.colors.gray[2],
        }}
      >
        <Box p="md" sx={{ ...buttonHoverStyles(theme) }}>
          <UnstyledButton
            sx={{
              borderTopRightRadius: theme.radius.sm,
              borderTopLeftRadius: theme.radius.sm,
              width: "100%",
              color:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[0]
                  : theme.black,
            }}
            component={Link}
            href={`/projects/${projectId}/settings/datasources/${datasource.id}`}
          >
            <Text>{datasource.name}</Text>
            <Text size="xs" color="dimmed">
              {datasource.baseUrl}
            </Text>
            <Text size="xs" color="dimmed">
              {new Date(datasource.updated).toLocaleString()}
            </Text>
          </UnstyledButton>
        </Box>
        <Flex
          py="xs"
          px="md"
          sx={{
            borderTop: "1px solid " + theme.colors.gray[2],
            width: "100%",
          }}
        >
          <Group position="apart" sx={{ width: "100%" }}>
            <Flex direction="column" justify="space-between">
              <Text size="xs" color="dimmed">
                Type
              </Text>
              <Text>{datasource.type}</Text>
            </Flex>
            <Menu width={250} withArrow offset={20}>
              <Menu.Target>
                <UnstyledButton
                  sx={{
                    borderRadius: theme.radius.sm,
                    ...buttonHoverStyles(theme),
                  }}
                >
                  <IconDots
                    size={LARGE_ICON_SIZE}
                    color={theme.colors.teal[5]}
                  />
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Data Source</Menu.Label>
                <Menu.Item
                  icon={<IconTrash size={ICON_SIZE} />}
                  color="red"
                  onClick={deleteFn}
                >
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Flex>
      </Box>
    </Col>
  );
}
