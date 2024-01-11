import { PageResponse } from "@/requests/pages/types";
import {
  DARK_COLOR,
  GRAY_COLOR,
  GRAY_WHITE_COLOR,
  HOVERED,
} from "@/utils/branding";
import { ICON_SIZE } from "@/utils/config";
import { Button, Stack, TextInput, useMantineTheme } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { PageItem } from "../PageItem";

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
            <PageItem
              key={page.id}
              page={page}
              setPage={setPage}
              projectId={projectId}
              currentPage={currentPage}
            />
          );
        })}
      </Stack>
    </>
  );
}
