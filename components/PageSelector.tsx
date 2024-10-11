import { useEditorParams } from "@/hooks/editor/useEditorParams";
import { usePageList } from "@/hooks/editor/usePageList";
import { Select } from "@mantine/core";
import { memo, useMemo } from "react";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useRouterWithLoader } from "@/hooks/useRouterWithLoader";

const PageSelector = () => {
  const router = useRouterWithLoader();
  const { id: projectId, page: pageId } = useEditorParams();
  const pages = usePageList(projectId);

  const flexStyles = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
  };

  const selectedPage = useMemo(
    () => pages.find((page) => page.value === pageId)?.value || "",
    [pages, pageId],
  );

  return (
    <Select
      label="Page"
      value={selectedPage}
      onChange={(value) => {
        const setSelectedComponentIds =
          useEditorTreeStore.getState().setSelectedComponentIds;
        setSelectedComponentIds(() => []);
        router.push(`/projects/${projectId}/editor/${value}`);
      }}
      size="xs"
      data={pages}
      sx={{
        ...flexStyles,
        whiteSpace: "nowrap",
      }}
      searchable
    />
  );
};

export default memo(PageSelector);
