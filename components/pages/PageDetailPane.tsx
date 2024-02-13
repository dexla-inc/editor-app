import { PageResponse } from "@/requests/pages/types";
import { SegmentedControl, Stack } from "@mantine/core";
import { useState } from "react";
import PageActions from "./PageActions";
import PageConfig from "./PageConfig";
import { deletePage, updatePage } from "@/requests/pages/mutations";
import { useEditorStore } from "@/stores/editor";

type PageDetailPaneProps = {
  page?: PageResponse | null | undefined;
  setPage: (page?: PageResponse | null | undefined) => void;
  invalidateQuery: () => void;
};

type Tab = "config" | "actions";
export default function PageDetailPane({
  page,
  setPage,
  invalidateQuery,
}: PageDetailPaneProps) {
  const [tab, setTab] = useState<Tab>("config");
  const projectId = useEditorStore((state) => state.currentProjectId!);
  const pageId = useEditorStore((state) => state.currentPageId!);

  const onUpdatePage = async (values: any) => {
    setPage(values);
    await updatePage(values, projectId, pageId);
    return invalidateQuery();
  };

  const onDeletePage = async () => {
    await deletePage(projectId, pageId);
    setPage(undefined);
    return invalidateQuery();
  };

  return (
    <Stack>
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
        <PageConfig
          page={page}
          setPage={setPage}
          invalidateQuery={invalidateQuery}
        />
      ) : (
        <PageActions page={page} onUpdatePage={onUpdatePage} />
      )}
    </Stack>
  );
}
