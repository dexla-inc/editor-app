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
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { IconFileAnalytics, IconHome, IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";

type InitialPaneProps = {
  projectId: string;
  pages: PageResponse[];
  setShowDetail: (id: boolean) => void;
  currentPage: string;
  debouncedSearch: (query: string) => void;
  search: string;
};

export default function InitialPane({
  setShowDetail,
  pages,
  currentPage,
  projectId,
  debouncedSearch,
}: InitialPaneProps) {
  const theme = useMantineTheme();
  const [search, setSearch] = useState<string>("");
  const resetTree = useEditorStore((state) => state.resetTree);

  return (
    <>
      <Button
        leftIcon={<IconPlus size={ICON_SIZE} />}
        onClick={() => setShowDetail(true)}
      >
        Add Page
      </Button>
      <TextInput
        placeholder="Search pages"
        defaultValue={search}
        onChange={(event) => debouncedSearch(event.currentTarget.value)}
      />
      <Stack spacing={0}>
        {pages.map((page) => {
          return (
            <UnstyledButton
              key={page.id}
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
                  borderRadius: theme.radius.md,
                  textDecoration: "none",
                  fontWeight: currentPage === page.id ? 500 : "normal",
                  color:
                    currentPage === page.id
                      ? theme.black
                      : theme.colors.gray[7],
                  backgroundColor:
                    currentPage === page.id ? theme.colors.gray[0] : undefined,

                  "&:hover": {
                    backgroundColor: theme.colors.gray[0],
                    color: theme.black,
                  },
                }}
              >
                <Flex gap="xs">
                  {page.isHome ? (
                    <IconHome size={ICON_SIZE} />
                  ) : (
                    <IconFileAnalytics size={ICON_SIZE} />
                  )}
                  <Text size="xs">{page.title}</Text>
                </Flex>
              </Group>
            </UnstyledButton>
          );
        })}
      </Stack>
    </>
  );
}
