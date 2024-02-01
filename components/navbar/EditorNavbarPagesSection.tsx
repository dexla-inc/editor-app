import InitialPane from "@/components/pages/InitialPane";
import PageDetailPane from "@/components/pages/PageDetailPane";
import { usePageListQuery } from "@/hooks/reactQuery/usePageListQuery";
import { PageResponse } from "@/requests/pages/types";
import { Stack } from "@mantine/core";
import debounce from "lodash.debounce";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

export const EditorNavbarPagesSection = () => {
  const router = useRouter();
  const projectId = router.query.id as string;
  const currentPage = router.query.page as string;
  const [page, setPage] = useState<PageResponse | undefined | null>();
  const [search, setSearch] = useState<string>("");
  const { data: pageListQuery, invalidate } = usePageListQuery(projectId);
  const [pages, setPages] = useState<PageResponse[] | undefined>();

  const debouncedSearch = useCallback(
    debounce((query) => setSearch(query), 150),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    if (pageListQuery?.results) {
      const filteredPages = pageListQuery.results.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase()),
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
        <PageDetailPane
          page={page}
          setPage={setPage}
          invalidateQuery={invalidate}
        />
      )}
    </Stack>
  );
};
