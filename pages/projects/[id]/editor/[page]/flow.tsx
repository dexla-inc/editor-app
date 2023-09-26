import { LogicFlow } from "@/components/LogicFlow";
import { LogicFlowShell } from "@/components/LogicFlowShell";
import { useEditorStore } from "@/stores/editor";
import { useFlowStore } from "@/stores/flow";
import { ASIDE_WIDTH, HEADER_HEIGHT } from "@/utils/config";
import { Box, useMantineTheme } from "@mantine/core";
import { GetServerSidePropsContext } from "next";
import { useEffect, useRef } from "react";

export const getServerSideProps = async ({
  query,
}: GetServerSidePropsContext) => {
  return {
    props: {
      id: query.id,
      page: query.page,
    },
  };
};

type Props = {
  id: string;
  page: string;
};

export default function LogicFlowPage({ id, page }: Props) {
  const theme = useMantineTheme();
  const reactFlowWrapper = useRef(null);
  const setCurrentProjectId = useEditorStore(
    (state) => state.setCurrentProjectId,
  );
  const setCurrentPageId = useEditorStore((state) => state.setCurrentPageId);
  const selectedFlowNode = useFlowStore((state) => state.selectedNode);

  useEffect(() => {
    if (id && page) {
      setCurrentProjectId(id);
      setCurrentPageId(page);
    }
  }, [id, page, setCurrentPageId, setCurrentProjectId]);

  return (
    <LogicFlowShell>
      <Box
        ref={reactFlowWrapper}
        style={{
          width: `calc(100vw - ${selectedFlowNode ? ASIDE_WIDTH : 0}px)`,
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          backgroundColor: theme.colors.gray[0],
        }}
      >
        <LogicFlow wrapperRef={reactFlowWrapper.current} />
      </Box>
    </LogicFlowShell>
  );
}
