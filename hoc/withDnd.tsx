import { ComponentType, Suspense } from "react";
import { withComponentVisibility } from "@/hoc/withComponentVisibility";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useGridStyling } from "@/libs/dnd-grid/hooks/useGridStyling";
import { useDndGridStore } from "@/libs/dnd-grid/stores/dndGridStore";
import { useEditorDroppableEvents } from "@/hooks/components/useEditorDroppableEvents";
import { useDnd } from "@/libs/dnd-grid/hooks/useDnd";

export const withDnd = <T extends Record<string, any>>(
  Component: ComponentType<T>,
) => {
  const ComponentWrapper = (props: any) => {
    const cssType = useEditorTreeStore((state) => state.cssType);

    return (
      <Suspense fallback={<></>}>
        {cssType === "FLEX" ? (
          <FlexComponent Component={Component} props={props} />
        ) : (
          <GridComponent Component={Component} props={props} />
        )}
      </Suspense>
    );
  };

  return withComponentVisibility(ComponentWrapper);
};

const FlexComponent = ({
  Component,
  props,
}: {
  Component: ComponentType<any>;
  props: any;
}) => {
  const { droppable: flexDnd } = useEditorDroppableEvents({
    componentId: props.component.id!,
  });

  return <Component {...props} {...flexDnd} />;
};

const GridComponent = ({
  Component,
  props,
}: {
  Component: ComponentType<any>;
  props: any;
}) => {
  const gridDnd = useDnd();
  const gridStyling = useGridStyling({ component: props.component });

  return (
    <Component
      {...props}
      {...gridDnd}
      style={gridStyling}
      onMouseOver={(e: React.MouseEvent) => {
        const { hoverComponentId, setHoverComponentId } =
          useDndGridStore.getState();
        if (hoverComponentId !== props.component.id) {
          setHoverComponentId(props.component.id ?? null);
        }
      }}
      onMouseLeave={(e: React.MouseEvent) => {
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
