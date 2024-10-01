import { forwardRef } from "react";
import { TOTAL_COLUMNS_WITH_MULTIPLIER } from "../types/constants";
import { ComponentType } from "../types/types";
import { useDnd } from "../hooks/useDnd";
import { useEditorStore } from "../stores/editor";

import { Button } from "./mapper/Button/Button";
import { Container } from "./mapper/Container/Container";
import { Text } from "./mapper/Text/Text";

const componentMapper = {
  button: Button,
  container: Container,
  text: Text,
};

const Grid = forwardRef(({ components }: any, ref: any) => {
  const { setSelectedComponentId, setHoverComponentId } = useEditorStore();
  const { onDrop, onDragOver } = useDnd();
  const renderComponent = (component: ComponentType) => {
    // @ts-ignore
    const CustomComponent = componentMapper[component.name];

    if (CustomComponent) {
      return (
        <CustomComponent
          key={component.id}
          component={component}
          renderTree={renderComponent}
          onClick={setSelectedComponentId}
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
        const { isInteracting } = useEditorStore.getState();
        if (!isInteracting) {
          setSelectedComponentId(null);
        }
      }}
      onMouseOver={(e) => {
        e.stopPropagation();
        setHoverComponentId(null);
      }}
    >
      {/* asdf */}
      {components.children.map((component: ComponentType) =>
        renderComponent(component),
      )}
    </div>
  );
});

Grid.displayName = "Grid";

export default Grid;
