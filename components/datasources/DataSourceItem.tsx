import { buttonHoverStyles } from "@/components/styles/buttonHoverStyles";
import { DataSourceResponse } from "@/requests/datasources/types";
import { useAppStore } from "@/stores/app";
import {
  Box,
  Col,
  Flex,
  Group,
  MantineTheme,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useRouter } from "next/router";
import { useState } from "react";

type DataSourceItemProps = {
  datasource: DataSourceResponse;
  theme: MantineTheme;
  isLoading: boolean;
  onDelete: (id: string) => void;
};

export function DataSourceItem({
  datasource,
  theme,
  isLoading,
  onDelete,
}: DataSourceItemProps) {
  const [pagesLoading, setPagesLoading] = useState(false);
  const router = useRouter();
  const startLoading = useAppStore((state) => state.startLoading);
  const projectId = router.query.id as string;

  const goToDetails = async () => {
    startLoading({
      id: "navigate",
      title: "Loading",
      message: "Wait while we load the details for this data source",
    });

    router.push(
      `/projects/${projectId}/settings/datasources/${datasource.id}}`
    );
  };

  return (
    <Col lg={4} md={6} xs={12}>
      <Box
        sx={{
          borderRadius: theme.radius.sm,
          border: "1px solid " + theme.colors.gray[2],
        }}
      >
        <UnstyledButton
          p="md"
          sx={{
            borderTopRightRadius: theme.radius.sm,
            borderTopLeftRadius: theme.radius.sm,
            width: "100%",
            color:
              theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
            ...buttonHoverStyles(theme),
          }}
          onClick={goToDetails}
        >
          {" "}
          <Text>{datasource.name}</Text>
          <Text size="xs" color="dimmed">
            {datasource.environment.baseUrl}
          </Text>
        </UnstyledButton>
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
            <Flex
              direction="column"
              justify="space-between"
              sx={{ height: "100%" }}
            >
              <Text size="xs" color="dimmed" align="right">
                Last Fetched
              </Text>
              <Text size="xs">
                {new Date(datasource.updated).toLocaleString()}
              </Text>
            </Flex>
          </Group>
        </Flex>
      </Box>
    </Col>
  );
}
