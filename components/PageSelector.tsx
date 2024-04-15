import { useEditorStore } from "@/stores/editor";
import { Select } from "@mantine/core";
import { useRouter } from "next/router";

const PageSelector = () => {
  const router = useRouter();
  const { id: projectId, page: pageId } = router.query as {
    id: string;
    page: string;
  };
  const pages = useEditorStore((state) => state.pages);

  const flexStyles = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
  };

  return (
    <Select
      label="Page"
      value={pages.find((page) => page.id === pageId)?.id || ""}
      onChange={(value) =>
        router.push(`/projects/${projectId}/editor/${value}`)
      }
      size="xs"
      data={pages.map((page) => ({ value: page.id, label: page.title }))}
      sx={{
        ...flexStyles,
        whiteSpace: "nowrap",
      }}
      searchable
    />
  );
};

export default PageSelector;
