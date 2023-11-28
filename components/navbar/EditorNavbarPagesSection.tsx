import InitialPane from "@/components/pages/InitialPane";
import PageDetailPane from "@/components/pages/PageDetailPane";
import { getPageList } from "@/requests/pages/queries";
import { PageResponse } from "@/requests/pages/types";
import { useEditorStore } from "@/stores/editor";
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
  const debouncedSearch = debounce((query) => setSearch(query), 150);
  const pages = useEditorStore((state) => state.pages);
  const setPages = useEditorStore((state) => state.setPages);

  const getPages = useCallback(async () => {
    const pageList = await getPageList(projectId, { search });
    setPages(pageList.results.sort((a, b) => a.title.localeCompare(b.title)));
  }, [projectId, search, setPages]);

  useEffect(() => {
    getPages();
  }, [projectId, getPages]);

  return (
    <Stack spacing="xs" w="100%">
      {page === undefined ? (
        <InitialPane
          projectId={projectId}
          setPage={setPage}
          pages={pages}
          currentPage={currentPage}
          debouncedSearch={debouncedSearch}
          search={search}
        />
      ) : (
        <PageDetailPane page={page} setPage={setPage} getPages={getPages} />
      )}
    </Stack>
  );
};
