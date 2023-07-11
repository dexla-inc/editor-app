import { getPageList } from "@/requests/pages/queries";
import { Stack } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import { useRouter } from "next/router";
import { useState } from "react";
import InitialPane from "../pages/InitialPane";
import PageDetailPane from "../pages/PageDetailPane";

type EditorNavbarPagesSectionProps = {
  isActive: boolean;
};

export const EditorNavbarPagesSection = ({
  isActive,
}: EditorNavbarPagesSectionProps) => {
  const router = useRouter();
  const projectId = router.query.id as string;
  const currentPage = router.query.page as string;
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = debounce((query) => setSearch(query), 200);

  const pages = useQuery({
    queryKey: ["pages"],
    queryFn: () => getPageList(projectId, {}),
    enabled: !!projectId && isActive,
  });

  return (
    <Stack spacing="xs">
      {!showDetail ? (
        <InitialPane
          setShowDetail={setShowDetail}
          pages={pages.data?.results || []}
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
