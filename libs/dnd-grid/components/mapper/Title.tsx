import { useDnd } from "@/libs/dnd-grid/hooks/useDnd";
import { useDndGridStore } from "@/libs/dnd-grid/stores/dndGridStore";
import { useShallow } from "zustand/react/shallow";
import { ResizeHandlers } from "@/libs/dnd-grid/components/ResizeHandlers";
import { Title as MantineTitle, TitleProps } from "@mantine/core";
import { forwardRef, memo } from "react";
import { EditableComponentMapper } from "@/utils/editor";
import { useGridStyling } from "@/libs/dnd-grid/hooks/useGridStyling";

type Props = EditableComponentMapper & TitleProps;

const TitleComponent = forwardRef<HTMLDivElement, Props>(
  ({ component }, ref) => {
    const { triggers } = component.props!;
    const dragTriggers = useDnd();
    const { setHoverComponentId } = useDndGridStore(
      useShallow((state) => state),
    );
    const gridStyling = useGridStyling({ component });

    return (
      <MantineTitle
        id={component.id}
        ref={ref}
        key={`${component.id}`}
        draggable
        {...dragTriggers}
        {...triggers}
        style={{
          ...gridStyling,
        }}
        onMouseOver={(e) => {
          const { hoverComponentId } = useDndGridStore.getState();
          if (hoverComponentId !== component.id) {
            setHoverComponentId(component.id ?? null);
          }
        }}
        onMouseLeave={(e) => {
          e.stopPropagation();
          const { hoverComponentId } = useDndGridStore.getState();
          if (hoverComponentId !== null) {
            setHoverComponentId(null);
          }
        }}
      >
        <div
          style={{
            display: "flex",
            gridArea: "1 / 1 / -1 / -1",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Title
          <ResizeHandlers componentId={component.id} />
        </div>
      </MantineTitle>
    );
  },
);

TitleComponent.displayName = "Title";

const orderToTag = (order: number) => {
  return {
    1: "H1",
    2: "H2",
    3: "H3",
    4: "H4",
    5: "H5",
    6: "H6",
  }[order];
};

export const Title = memo(TitleComponent);
