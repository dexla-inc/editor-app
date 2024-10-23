import { IFrame } from "@/components/IFrame";
import useEditorHotkeys from "@/hooks/editor/useEditorHotkeys";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useEditorStore } from "@/stores/editor";
import { componentMapper } from "@/utils/componentMapper";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { memo } from "react";
import { RenderTreeFunc } from "@/types/component";
import ComponentToolbox from "@/libs/dnd-grid/components/ComponentToolbox";
import ErrorBoundary from "@/libs/dnd-grid/components/ErrorBoundary";
import { useDndGridStore } from "@/libs/dnd-grid/stores/dndGridStore";
import { useDnd } from "../hooks/useDnd";
import { TOTAL_COLUMNS_WITH_MULTIPLIER } from "../types/constants";

type Props = {
  projectId: string;
};

const EditorCanvasComponent = ({ projectId }: Props) => {
  const editorTree = useEditorTreeStore((state) => state.tree);
  const setSelectedComponentIds = useEditorTreeStore(
    (state) => state.setSelectedComponentIds,
  );
  const isComponentSelected = useEditorTreeStore(
    (state) => state.selectedComponentIds?.length,
  );

  const setHoverComponentId = useEditorStore(
    (state) => state.setHoverComponentId,
  );
  const { onDrop, onDragOver } = useDnd();
  const [canvasRef] = useAutoAnimate();

  const renderTree: RenderTreeFunc = (componentTree, shareableContent) => {
    if (componentTree.id === "main-grid") {
      return (
        <div
          id="main-grid"
          ref={canvasRef}
          style={{
            display: "grid",
            gap: "0",
            border: "2px solid #d1d5db",
            gridAutoRows: `10px`,
            gridTemplateColumns: `repeat(${TOTAL_COLUMNS_WITH_MULTIPLIER}, 1fr)`,
            minHeight: "400px",
            backgroundSize: `calc(100% / ${TOTAL_COLUMNS_WITH_MULTIPLIER}) 10px`,
            backgroundImage: `
            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
          `,
          }}
          draggable={false}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onMouseDown={() => {
            const { isInteracting } = useDndGridStore.getState();
            if (!isInteracting) {
              setSelectedComponentIds(() => []);
            }
          }}
          onMouseOver={(e) => {
            e.stopPropagation();
            setHoverComponentId(null);
          }}
        >
          {componentTree.children?.map((child) =>
            renderTree(child, shareableContent),
          )}
        </div>
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
    <IFrame projectId={projectId}>
      <ErrorBoundary>
        <div style={{ background: "white" }}>{renderTree(editorTree.root)}</div>
      </ErrorBoundary>
      {isComponentSelected && <ComponentToolbox />}
    </IFrame>
  );
};

export const EditorCanvas = memo(EditorCanvasComponent);
