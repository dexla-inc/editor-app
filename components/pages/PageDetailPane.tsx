import { updatePage } from "@/requests/pages/mutations";
import { PageListResponse, PageResponse } from "@/requests/pages/types";
import { Box, SegmentedControl } from "@mantine/core";
import { useState } from "react";
import PageActions from "./PageActions";
import PageConfig from "./PageConfig";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useEditorStore } from "@/stores/editor";
import { queryClient } from "@/utils/reactQuery";

type PageDetailPaneProps = {
  page?: PageResponse | null | undefined;
  setPage: (page?: PageResponse | null | undefined) => void;
};

type Tab = "config" | "actions";
export default function PageDetailPane({ page, setPage }: PageDetailPaneProps) {
  const [tab, setTab] = useState<Tab>("config");
  const projectId = useEditorTreeStore((state) => state.currentProjectId!);
  const updatePageResponse = useEditorStore(
    (state) => state.updatePageResponse,
  );

  const queryKey = ["pages", projectId, null];

  const onUpdatePage = async (values: any) => {
    console.log("values", values);
    setPage(values);
    const result = await updatePage(values, projectId, page?.id as string);

    queryClient.setQueryData(queryKey, (oldData?: PageListResponse) => {
      if (!oldData || !oldData.results) {
        return { results: [result] };
      }

      return {
        ...oldData,
        results: oldData.results.map((p) =>
          p.id === page?.id ? { ...p, ...result } : p,
        ),
      };
    });

    updatePageResponse(result);
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
