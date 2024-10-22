import { forwardRef } from "react";
import { TOTAL_COLUMNS_WITH_MULTIPLIER } from "@/libs/dnd-grid/types/constants";
import { useDnd } from "@/libs/dnd-grid/hooks/useDnd";
import { useDndGridStore } from "@/libs/dnd-grid/stores/dndGridStore";
import { componentMapper } from "@/utils/componentMapper";
import { ComponentStructure } from "@/utils/editor";
import merge from "lodash.merge";
import { useEditorTreeStore } from "@/stores/editorTree";

const Grid = forwardRef(({}: any, ref: any) => {
  const editorTree = useEditorTreeStore((state) => state.tree);
  const components = editorTree.root;
  const setSelectedComponentIds = useEditorTreeStore(
    (state) => state.setSelectedComponentIds,
  );
  const setHoverComponentId = useDndGridStore(
    (state) => state.setHoverComponentId,
  );
  const { onDrop, onDragOver } = useDnd();
  const renderComponent = (component: ComponentStructure) => {
    const CustomComponent = componentMapper[component.name].Component;

    const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      setSelectedComponentIds(() => [component.id!]);
    };

    if (CustomComponent) {
      return (
        <CustomComponent
          key={component.id}
          component={merge({}, component, {
            props: { triggers: { onClick } },
          })}
          renderTree={renderComponent}
        />
      );
    }
  };

  return (
    <div
      id="main-grid"
      ref={ref}
      style={{
        display: "grid",
        gap: "0",
        border: "2px solid #d1d5db",
        marginTop: "1rem",
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
      {components?.children?.map((component: ComponentStructure) =>
        renderComponent(component),
      )}
    </div>
  );
});

Grid.displayName = "Grid";

export default Grid;
