import { Droppable } from "@/components/Droppable";
import { IFrame } from "@/components/IFrame";
import useEditorHotkeys from "@/hooks/editor/useEditorHotkeys";
import { useEditorTreeStore } from "@/stores/editorTree";
import { componentMapper } from "@/utils/componentMapper";
import { HEADER_HEIGHT } from "@/utils/config";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Box, Paper } from "@mantine/core";
import { memo } from "react";
import { CustomComponentModal } from "@/components/CustomComponentModal";
import { useUserConfigStore } from "@/stores/userConfig";
import { RenderTreeFunc } from "@/types/component";
import { ComponentToolbox } from "@/components/ComponentToolbox";

type Props = {
  projectId: string;
};

const EditorCanvasComponent = ({ projectId }: Props) => {
  const isComponentSelected = useEditorTreeStore(
    (state) =>
      !!(state.selectedComponentIds && state.selectedComponentIds.length > 0),
  );
  const editorTree = useEditorTreeStore((state) => state.tree);
  useEditorHotkeys();

  const [canvasRef] = useAutoAnimate();
  const isCustomComponentModalOpen = useUserConfigStore(
    (state) => state.isCustomComponentModalOpen,
  );

  const renderTree: RenderTreeFunc = (componentTree, shareableContent) => {
    if (componentTree.id === "root") {
      return (
        <Droppable
          key={`${componentTree.id}`}
          id={componentTree.id}
          m={0}
          p={2}
          miw={980}
        >
          <Paper
            shadow="xs"
            ref={canvasRef}
            bg="gray.0"
            display="flex"
            h="100%"
            sx={{ flexDirection: "column" }}
          >
            {componentTree.children?.map((child) =>
              renderTree(child, shareableContent),
            )}
          </Paper>
        </Droppable>
      );
    }

    const componentToRender = componentMapper[componentTree.name];

    if (!componentToRender) {
      return componentTree.children?.map((child) =>
        renderTree(child, shareableContent),
      );
    }

    return componentToRender?.Component({
      component: componentTree,
      renderTree,
      shareableContent,
    });
  };

  if ((editorTree?.root?.children ?? [])?.length === 0) {
    return null;
  }

  return (
    <>
      <Box
        pos="relative"
        style={{
          minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
          height: "100%",
          overflow: "hidden",
        }}
        p={0}
        // TODO: get this back - turn it off for now
        // onPointerMove={(event) => {
        //   event.preventDefault();
        //   setCursor({
        //     x: Math.round(event.clientX),
        //     y: Math.round(event.clientY),
        //   });
        // }}
        // onPointerLeave={() => setCursor(undefined)}
      >
        <IFrame projectId={projectId}>
          {renderTree(editorTree.root)}
          {isComponentSelected && <ComponentToolbox />}
        </IFrame>
        {isCustomComponentModalOpen && (
          <CustomComponentModal
            isCustomComponentModalOpen={isCustomComponentModalOpen}
          />
        )}
      </Box>
    </>
  );
};

export const EditorCanvas = memo(EditorCanvasComponent);
