import { PageResponse } from "@/requests/pages/types";
import { useEditorStore } from "@/stores/editor";
import { ICON_SIZE } from "@/utils/config";
import {
  Button,
  Flex,
  Group,
  Stack,
  Text,
  TextInput,
  Tooltip,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import {
  IconFileAnalytics,
  IconHome,
  IconPlus,
  IconSettings,
} from "@tabler/icons-react";
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
      />
      <Stack spacing={0}>
        {pages.map((page) => {
          return (
            <Tooltip key={page.id} label={page.title} fz="xs">
              <UnstyledButton
                component={Link}
                href={`/projects/${projectId}/editor/${page.id}`}
                onClick={() => {
                  resetTree();
                }}
              >
                <Group
                  p="xs"
                  spacing="sm"
                  position="apart"
                  align="center"
                  sx={{
                    flexWrap: "nowrap",
                    borderRadius: theme.radius.md,
                    textDecoration: "none",
                    fontWeight: currentPage === page.id ? 500 : "normal",
                    color:
                      currentPage === page.id
                        ? theme.black
                        : theme.colors.gray[7],
                    backgroundColor:
                      currentPage === page.id
                        ? theme.colors.gray[0]
                        : undefined,

                    "&:hover": {
                      backgroundColor: theme.colors.gray[0],
                      color: theme.black,
                    },
                  }}
                >
                  <Flex gap="xs" sx={{ maxWidth: 180 }}>
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
                      {page.title}{" "}
                    </Text>
                  </Flex>
                  <UnstyledButton
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setPage(page);
                    }}
                    p={5}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: theme.radius.md,
                      "&:hover": {
                        backgroundColor: theme.colors.teal[5],
                        color: theme.white,
                      },
                    }}
                  >
                    <IconSettings size={ICON_SIZE} />
                  </UnstyledButton>
                </Group>
              </UnstyledButton>
            </Tooltip>
          );
        })}
      </Stack>
    </>
  );
}
