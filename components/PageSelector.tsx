import { useEditorParams } from "@/hooks/editor/useEditorParams";
import { useEditorStore } from "@/stores/editor";
import { Select } from "@mantine/core";
import { useParams, useRouter } from "next/navigation";
import { memo, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

const PageSelector = () => {
  const router = useRouter();
  const { id: projectId, page: pageId } = useEditorParams();
  const pages = useEditorStore(
    useShallow((state) =>
      state.pages.map((page) => ({ value: page.id, label: page.title })),
    ),
  );

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
      onChange={(value) =>
        router.push(`/projects/${projectId}/editor/${value}`)
      }
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
