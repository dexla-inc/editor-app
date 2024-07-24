import { PageResponse } from "@/requests/pages/types";
import { Box, SegmentedControl } from "@mantine/core";
import PageActions from "./PageActions";
import PageConfig from "./PageConfig";
import { useEditorStore } from "@/stores/editor";

type PageDetailPaneProps = {
  page?: PageResponse | null | undefined;
  setPage: (page?: PageResponse | null | undefined) => void;
};

type Tab = "config" | "actions";
export default function PageDetailPane({ page, setPage }: PageDetailPaneProps) {
  const activeSubTab = useEditorStore((state) => state.activeSubTab);
  const setActiveSubTab = useEditorStore((state) => state.setActiveSubTab);

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
          setActiveSubTab(value as Tab);
        }}
        value={activeSubTab}
        mb="xs"
      />
      {activeSubTab === "config" ? (
        <PageConfig page={page} setPage={setPage} />
      ) : (
        <PageActions page={page} setPage={setPage} />
      )}
    </Box>
  );
}
