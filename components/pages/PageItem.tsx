import { ActionIconDefault } from "@/components/ActionIconDefault";
import { PageResponse } from "@/requests/pages/types";
import {
  DARK_COLOR,
  GRAY_COLOR,
  GRAY_WHITE_COLOR,
  HOVERED,
} from "@/utils/branding";
import { ICON_SIZE } from "@/utils/config";
import {
  Flex,
  Group,
  Text,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { IconFileAnalytics, IconHome } from "@tabler/icons-react";
import Link from "next/link";

type Props = {
  projectId: string;
  page: PageResponse;
  setPage: (page?: PageResponse | null) => void;
  currentPage: string;
};

export const PageItem = ({ projectId, page, currentPage, setPage }: Props) => {
  const theme = useMantineTheme();
  const { color, background, hoveredBackground, hoveredColor, whiteColor } = {
    color: theme.colorScheme === "dark" ? GRAY_WHITE_COLOR : theme.black,
    background:
      theme.colorScheme === "dark" ? theme.colors.dark[5] : GRAY_WHITE_COLOR,
    hoveredBackground: theme.colorScheme === "dark" ? DARK_COLOR : HOVERED,
    hoveredColor: theme.colorScheme === "dark" ? GRAY_WHITE_COLOR : theme.black,
    whiteColor:
      theme.colorScheme === "dark" ? GRAY_COLOR : theme.colors.gray[7],
  };

  const isCurrentPage = currentPage === page.id;

  return (
    <UnstyledButton
      key={page.id}
      component={Link}
      href={`/projects/${projectId}/editor/${page.id}`}
    >
      <Group
        px="xs"
        py={4}
        spacing="sm"
        position="apart"
        align="center"
        sx={(theme) => ({
          flexWrap: "nowrap",
          borderRadius: theme.radius.sm,
          textDecoration: "none",
          fontWeight: isCurrentPage ? 500 : "normal",
          color: isCurrentPage ? color : whiteColor,
          backgroundColor: isCurrentPage ? background : undefined,

          "&:hover": {
            backgroundColor: hoveredBackground,
            color: hoveredColor,
          },
        })}
      >
        <Flex gap="xs" sx={{ maxWidth: 164 }}>
          <Flex style={{ flex: "0 0 auto" }}>
            {page.isHome ? (
              <IconHome size={ICON_SIZE} style={{ flex: "flex-grow" }} />
            ) : (
              <IconFileAnalytics size={ICON_SIZE} />
            )}
          </Flex>
          <Text size="xs" truncate>
            {page.title}
          </Text>
        </Flex>
        <ActionIconDefault
          iconName="IconSettings"
          tooltip="Page Settings"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setPage(page);
          }}
          color="white"
        />
      </Group>
    </UnstyledButton>
  );
};
