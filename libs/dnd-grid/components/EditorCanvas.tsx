import { IFrame } from "@/components/IFrame";
import useEditorHotkeys from "@/hooks/editor/useEditorHotkeys";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useEditorStore } from "@/stores/editor";
import { componentMapper } from "@/utils/componentMapper";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { memo, useEffect, useState } from "react";
import { RenderTreeFunc } from "@/types/component";
import ComponentToolbox from "@/libs/dnd-grid/components/ComponentToolbox";
import ErrorBoundary from "@/libs/dnd-grid/components/ErrorBoundary";
import { useDndGridStore } from "@/libs/dnd-grid/stores/dndGridStore";
import { TOTAL_COLUMNS_WITH_MULTIPLIER } from "../types/constants";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { Box } from "@mantine/core";
import { getBaseElementId } from "@/libs/dnd-grid/utils/engines/finder";

type Props = {
  projectId: string;
};

const MainGridComponent = ({
  component: componentTree,
  renderTree,
  shareableContent,
  style,
  grid,
  ...props
}: any) => {
  const { onDrop, onDragOver, sx } = props;
  const {
    props: { triggers, ...componentProps },
  } = componentTree;
  const [canvasRef] = useAutoAnimate();

  const setSelectedComponentIds = useEditorTreeStore(
    (state) => state.setSelectedComponentIds,
  );
  const setHoverComponentId = useEditorStore(
    (state) => state.setHoverComponentId,
  );
  const isInteracting = useDndGridStore((state) => state.isInteracting);
  const [showGrid, setShowGrid] = useState(false);

  useEffect(() => {
    const isMainGrid = getBaseElementId() === "main-grid";
    if (isMainGrid && isInteracting) {
      setShowGrid(true);
    } else {
      setShowGrid(false);
    }
  }, [isInteracting]);

  return (
    <Box
      unstyled
      {...componentProps}
      id="main-grid"
      ref={canvasRef}
      sx={{
        ...sx,
        ...(showGrid && {
          "&:after": {
            content: '""',
            position: "absolute",
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            width: "100%",
            height: "100%",
            zIndex: 100,
            backgroundSize: `calc(100% / ${TOTAL_COLUMNS_WITH_MULTIPLIER}) 10px`,
            backgroundImage: `
              linear-gradient(to right, rgba(229, 231, 235, 0.5) 0.75px, transparent 0.5px),
              linear-gradient(to bottom, rgba(229, 231, 235, 0.5) 0.75px, transparent 0.5px)
            `,
          },
        }),
      }}
      style={{
        display: "grid",
        gap: "0",
        border: "2px solid #d1d5db",
        gridAutoRows: `10px`,
        gridTemplateColumns: `repeat(${TOTAL_COLUMNS_WITH_MULTIPLIER}, 1fr)`,
        minHeight: "100%",
        width: "100%",
      }}
      draggable={false}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onMouseDown={() => {
        const { isInteracting } = useDndGridStore.getState();
        if (!isInteracting) {
          setSelectedComponentIds(() => ["main-grid"]);
        }
      }}
      onMouseOver={(e) => {
        e.stopPropagation();
        setHoverComponentId(null);
      }}
    >
      {componentTree.children?.map((child: any) =>
        renderTree(child, shareableContent),
      )}
    </Box>
  );
};

const MainGrid = memo(withComponentWrapper(MainGridComponent));

const EditorCanvasComponent = ({ projectId }: Props) => {
  const editorTree = useEditorTreeStore((state) => state.tree);
  const isComponentSelected = useEditorTreeStore(
    (state) => !!state.selectedComponentIds?.length,
  );

  useEditorHotkeys();

  const renderTree: RenderTreeFunc = (componentTree, shareableContent) => {
    if (componentTree.id === "main-grid") {
      return (
        <MainGrid
          component={componentTree}
          renderTree={renderTree}
          shareableContent={shareableContent}
        />
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

  return (
    <IFrame projectId={projectId}>
      <ErrorBoundary>
        <div
          style={{
            background: "white",
            minHeight: "100%",
            display: "flex",
            flex: 1,
          }}
        >
          {renderTree(editorTree.root)}
        </div>
      </ErrorBoundary>
      {isComponentSelected && <ComponentToolbox />}
    </IFrame>
  );
};

export const EditorCanvas = memo(EditorCanvasComponent);
