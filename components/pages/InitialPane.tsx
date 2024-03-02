import { PageItem } from "@/components/pages/PageItem";
import { PageResponse } from "@/requests/pages/types";
import { ICON_SIZE } from "@/utils/config";
import { Button, Stack, TextInput } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

type InitialPaneProps = {
  projectId: string;
  setPage: (page?: PageResponse | null) => void;
  currentPage: string;
  pages?: PageResponse[];
  debouncedSearch: (query: string) => void;
};

export default function InitialPane({
  projectId,
  setPage,
  pages,
  currentPage,
  debouncedSearch,
}: InitialPaneProps) {
  return (
    <Stack p="xs" pr={0}>
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
        {pages?.map((page) => {
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
    </Stack>
  );
}
