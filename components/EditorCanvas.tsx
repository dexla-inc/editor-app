import { ComponentToolbox } from "@/components/ComponentToolbox";
import { CustomComponentModal } from "@/components/CustomComponentModal";
import { Droppable } from "@/components/Droppable";
import { EditableComponentContainer } from "@/components/EditableComponentContainer";
import { IFrame } from "@/components/IFrame";
import useEditorHotkeys from "@/hooks/useEditorHotkeys";
import { useEditorTreeStore } from "@/stores/editorTree";
import { componentMapper } from "@/utils/componentMapper";
import { HEADER_HEIGHT } from "@/utils/config";
import { ComponentTree } from "@/utils/editor";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Box, Paper } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { memo } from "react";

type Props = {
  projectId: string;
};

const EditorCanvasComponent = ({ projectId }: Props) => {
  const editorTree = useEditorTreeStore((state) => state.tree);
  useEditorHotkeys();
  const [canvasRef] = useAutoAnimate();
  const [isCustomComponentModalOpen, customComponentModal] =
    useDisclosure(false);

  const renderTree = (componentTree: ComponentTree, shareableContent = {}) => {
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
            sx={{ flexDirection: "column" }}
          >
            {componentTree.children?.map((child) => renderTree(child))}
          </Paper>
        </Droppable>
      );
    }

    const component =
      useEditorTreeStore.getState().componentMutableAttrs[componentTree.id!];
    const componentToRender = componentMapper[component.name];

    if (!componentToRender) {
      return (
        <EditableComponentContainer
          key={`${component.id}`}
          componentTree={componentTree}
          shareableContent={shareableContent}
        >
          {componentTree.children?.map((child) => renderTree(child))}
        </EditableComponentContainer>
      );
    }

    return (
      <EditableComponentContainer
        key={`${component.id}`}
        componentTree={componentTree}
        shareableContent={shareableContent}
      >
        {componentToRender?.Component({ component, renderTree })}
      </EditableComponentContainer>
    );
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
        <IFrame projectId={projectId}>{renderTree(editorTree.root)}</IFrame>
      </Box>
      {isCustomComponentModalOpen && (
        <CustomComponentModal
          customComponentModal={customComponentModal}
          isCustomComponentModalOpen={isCustomComponentModalOpen}
        />
      )}
    </>
  );
};

export const EditorCanvas = memo(EditorCanvasComponent);
