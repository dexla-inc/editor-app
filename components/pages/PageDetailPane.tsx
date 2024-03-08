import { deletePage, updatePage } from "@/requests/pages/mutations";
import { PageResponse } from "@/requests/pages/types";
import { useEditorStore } from "@/stores/editor";
import { Box, SegmentedControl } from "@mantine/core";
import { useState } from "react";
import PageActions from "./PageActions";
import PageConfig from "./PageConfig";
import { useEditorTreeStore } from "@/stores/editorTree";

type PageDetailPaneProps = {
  page?: PageResponse | null | undefined;
  setPage: (page?: PageResponse | null | undefined) => void;
};

type Tab = "config" | "actions";
export default function PageDetailPane({ page, setPage }: PageDetailPaneProps) {
  const [tab, setTab] = useState<Tab>("config");
  const projectId = useEditorTreeStore((state) => state.currentProjectId!);
  const pageId = useEditorTreeStore((state) => state.currentPageId!);

  const onUpdatePage = async (values: any) => {
    setPage(values);
    await updatePage(values, projectId, pageId);
  };

  const onDeletePage = async () => {
    await deletePage(projectId, pageId);
    setPage(undefined);
  };

  return (
    <Box p="xs" pr={0}>
      <SegmentedControl
        size="xs"
        style={{ width: "100%" }}
        data={[
          { label: "Config", value: "config" },
          {
            label: "Actions",
            value: "actions",
            disabled: page?.id === undefined,
          },
        ]}
        onChange={(value) => {
          setTab(value as Tab);
        }}
        value={tab}
        mb="xs"
      />
      {tab === "config" ? (
        <PageConfig page={page} setPage={setPage} />
      ) : (
        <PageActions page={page} onUpdatePage={onUpdatePage} />
      )}
    </Box>
  );
}
