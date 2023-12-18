import { ActionIconDefault } from "@/components/ActionIconDefault";
import { PageResponse } from "@/requests/pages/types";
import { useEditorStore } from "@/stores/editor";
import {
  DARK_COLOR,
  GRAY_COLOR,
  GRAY_WHITE_COLOR,
  HOVERED,
} from "@/utils/branding";
import { ICON_SIZE } from "@/utils/config";
import {
  Button,
  Flex,
  Group,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { IconFileAnalytics, IconHome, IconPlus } from "@tabler/icons-react";
import Link from "next/link";

type InitialPaneProps = {
  projectId: string;
  pages: PageResponse[];
  setPage: (page?: PageResponse | null) => void;
  currentPage: string;
  debouncedSearch: (query: string) => void;
  search: string;
};

export default function InitialPane({
  projectId,
  setPage,
  pages,
  currentPage,
  debouncedSearch,
}: InitialPaneProps) {
  const theme = useMantineTheme();
  const resetTree = useEditorStore((state) => state.resetTree);
  const liveblocks = useEditorStore((state) => state.liveblocks);
  const { color, background, hoveredBackground, hoveredColor, whiteColor } = {
    color: theme.colorScheme === "dark" ? GRAY_WHITE_COLOR : theme.black,
    background: theme.colorScheme === "dark" ? DARK_COLOR : GRAY_WHITE_COLOR,
    hoveredBackground: theme.colorScheme === "dark" ? DARK_COLOR : HOVERED,
    hoveredColor: theme.colorScheme === "dark" ? GRAY_WHITE_COLOR : theme.black,
    whiteColor:
      theme.colorScheme === "dark" ? GRAY_COLOR : theme.colors.gray[7],
  };

  return (
    <>
      <Button
        leftIcon={<IconPlus size={ICON_SIZE} />}
        onClick={() => setPage(null)}
        compact
      >
        Add Page
      </Button>
      <TextInput
        placeholder="Search pages"
        onChange={(event) => {
          debouncedSearch(event.currentTarget.value);
        }}
        size="xs"
      />
      <Stack spacing={2}>
        {pages.map((page) => {
          return (
            <UnstyledButton
              key={page.id}
              component={Link}
              href={`/projects/${projectId}/editor/${page.id}`}
              onClick={() => {
                liveblocks.leaveRoom();
                resetTree();
                currentPage !== page.id && resetTree();
              }}
            >
              <Group
                px="xs"
                py={4}
                spacing="sm"
                position="apart"
                align="center"
                sx={{
                  flexWrap: "nowrap",
                  borderRadius: theme.radius.sm,
                  textDecoration: "none",
                  fontWeight: currentPage === page.id ? 500 : "normal",
                  color: currentPage === page.id ? color : whiteColor,
                  backgroundColor:
                    currentPage === page.id ? background : undefined,

                  "&:hover": {
                    backgroundColor: hoveredBackground,
                    color: hoveredColor,
                  },
                }}
              >
                <Flex gap="xs" sx={{ maxWidth: 164 }}>
                  <Flex style={{ flex: "0 0 auto" }}>
                    {page.isHome ? (
                      <IconHome
                        size={ICON_SIZE}
                        style={{ flex: "flex-grow" }}
                      />
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
        })}
      </Stack>
    </>
  );
}
