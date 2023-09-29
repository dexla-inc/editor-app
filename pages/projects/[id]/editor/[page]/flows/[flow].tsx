import { LogicFlow } from "@/components/logic-flow/LogicFlow";
import { LogicFlowShell } from "@/components/logic-flow/LogicFlowShell";
import { useEditorStore } from "@/stores/editor";
import { useFlowStore } from "@/stores/flow";
import { decodeSchema } from "@/utils/compression";
import { ASIDE_WIDTH, HEADER_HEIGHT } from "@/utils/config";
import { Box, useMantineTheme } from "@mantine/core";
import { LogicFlow as LogicFlowType } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { useEffect, useRef } from "react";

export const getServerSideProps = async ({
  query,
}: GetServerSidePropsContext) => {
  const flowId = query.flow as string;

  const url = `${process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL}/api/logic-flows/${flowId}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const logicFlow = await response.json();

  return {
    props: {
      id: query.id,
      pageId: query.page,
      flow: logicFlow,
    },
  };
};

type Props = {
  id: string;
  pageId: string;
  flow: LogicFlowType;
};

export default function LogicFlowsPage({ id, pageId, flow }: Props) {
  const theme = useMantineTheme();
  const reactFlowWrapper = useRef(null);
  const setCurrentProjectId = useEditorStore(
    (state) => state.setCurrentProjectId,
  );
  const setCurrentPageId = useEditorStore((state) => state.setCurrentPageId);
  const selectedFlowNode = useFlowStore((state) => state.selectedNode);
  const restoreFlow = useFlowStore((state) => state.restoreFlow);

  useEffect(() => {
    if (id && pageId) {
      setCurrentProjectId(id);
      setCurrentPageId(pageId);
    }
  }, [id, pageId, setCurrentPageId, setCurrentProjectId]);

  useEffect(() => {
    if (flow?.data) {
      const data = JSON.parse(decodeSchema(flow.data as string));
      restoreFlow(data as any);
    }
  }, [flow?.data, restoreFlow]);

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
