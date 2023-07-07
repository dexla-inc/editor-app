import { getPageList } from "@/requests/pages/queries";
import { Stack } from "@mantine/core";
import debounce from "lodash.debounce";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import InitialPane from "../pages/InitialPane";
import PageDetailPane from "../pages/PageDetailPane";
import { useEditorStore } from "@/stores/editor";

export const EditorNavbarPagesSection = () => {
  const router = useRouter();
  const projectId = router.query.id as string;
  const currentPage = router.query.page as string;
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = debounce((query) => setSearch(query), 200);
  const pages = useEditorStore((state) => state.pages);
  const setPages = useEditorStore((state) => state.setPages);

  const getPages = useCallback(async () => {
    const pageList = await getPageList(projectId, { search });
    setPages(pageList.results);
  }, [projectId, search, setPages]);

  useEffect(() => {
    getPages();
  }, [projectId, getPages]);

  return (
    <Stack spacing="xs">
      {!showDetail ? (
        <InitialPane
          setShowDetail={setShowDetail}
          pages={pages}
          currentPage={currentPage}
          projectId={projectId}
          debouncedSearch={debouncedSearch}
          search={search}
        />
      ) : (
        <PageDetailPane setShowDetail={setShowDetail} />
      )}
    </Stack>
  );
};
