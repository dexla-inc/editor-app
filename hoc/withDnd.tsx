import { ComponentType } from "react";
import { withComponentVisibility } from "@/hoc/withComponentVisibility";
import { useEditorDroppableEvents } from "@/hooks/components/useEditorDroppableEvents";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useDnd } from "@/libs/dnd-grid/hooks/useDnd";
import { useGridStyling } from "@/libs/dnd-grid/hooks/useGridStyling";
import { useDndGridStore } from "@/libs/dnd-grid/stores/dndGridStore";

export const withDnd = <T extends Record<string, any>>(
  Component: ComponentType<T>,
) => {
  const ComponentWrapper = (props: any) => {
    const cssType = useEditorTreeStore((state) => state.cssType);
    const gridDnd = useDnd();
    const gridStyling = useGridStyling({ component: props.component });

    const { droppable: flexDnd } = useEditorDroppableEvents({
      componentId: props.component.id!,
    });

    if (cssType === "FLEX") {
      return <Component {...props} {...flexDnd} />;
    }

    return (
      <Component
        {...props}
        {...gridDnd}
        style={gridStyling}
        onMouseOver={(e: any) => {
          const { hoverComponentId, setHoverComponentId } =
            useDndGridStore.getState();
          if (hoverComponentId !== props.component.id) {
            setHoverComponentId(props.component.id ?? null);
          }
        }}
        onMouseLeave={(e: any) => {
          e.stopPropagation();
          const { hoverComponentId, setHoverComponentId } =
            useDndGridStore.getState();
          if (hoverComponentId !== null) {
            setHoverComponentId(null);
          }
        }}
      />
    );
  };

  return withComponentVisibility(ComponentWrapper);
};
