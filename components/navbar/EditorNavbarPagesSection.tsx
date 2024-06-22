import InitialPane from "@/components/pages/InitialPane";
import PageDetailPane from "@/components/pages/PageDetailPane";
import { usePageListQuery } from "@/hooks/editor/reactQuery/usePageListQuery";
import { PageResponse } from "@/requests/pages/types";
import { Stack } from "@mantine/core";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useState } from "react";
import { useEditorStore } from "@/stores/editor";
import { useEditorParams } from "@/hooks/editor/useEditorParams";

export const EditorNavbarPagesSection = () => {
  const { id: projectId, page: currentPage } = useEditorParams();
  const page = useEditorStore((state) => state.activePage);
  const setPage = useEditorStore((state) => state.setActivePage);
  const [search, setSearch] = useState<string>("");
  const { data: pageListQuery } = usePageListQuery(projectId, null);
  const [pages, setPages] = useState<PageResponse[] | undefined>();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((query) => setSearch(query), 150),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    if (pageListQuery?.results) {
      const filteredPages = pageListQuery.results.filter((p) =>
        p.title?.toLowerCase().includes(search?.toLowerCase()),
      );
      setPages(filteredPages);
    }
  }, [pageListQuery, search]);

  return (
    <Stack spacing="xs" w="100%">
      {page === undefined ? (
        <InitialPane
          projectId={projectId}
          setPage={setPage}
          currentPage={currentPage}
          pages={pages}
          debouncedSearch={debouncedSearch}
        />
      ) : (
        <PageDetailPane page={page} setPage={setPage} />
      )}
    </Stack>
  );
};
