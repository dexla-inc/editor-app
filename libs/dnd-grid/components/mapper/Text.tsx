import { FlexProps, Text as MantineText } from "@mantine/core";
import { forwardRef, memo } from "react";
import { EditableComponentMapper } from "@/utils/editor";
import { useDnd } from "@/libs/dnd-grid/hooks/useDnd";
import { useDndGridStore } from "@/libs/dnd-grid/stores/dndGridStore";
import { useShallow } from "zustand/react/shallow";
import { ResizeHandlers } from "@/libs/dnd-grid/components/ResizeHandlers";
import { useGridStyling } from "@/libs/dnd-grid/hooks/useGridStyling";

type Props = EditableComponentMapper & FlexProps;

const TextComponent = forwardRef<HTMLDivElement, Props>(
  ({ component }, ref) => {
    const { triggers } = component.props!;
    const dragTriggers = useDnd();
    
    const gridStyling = useGridStyling({ component });
    const { setHoverComponentId } = useDndGridStore(
      useShallow((state) => state),
    );

    const { style, ...componentProps } = component.props ?? {};

    return (
      <MantineText
        id={component.id}
        draggable
        {...dragTriggers}
        {...triggers}
        {...componentProps}
        style={{
          ...style,
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
        ref={ref}
      >
        <div
          style={{
            display: "flex",
            gridArea: "1 / 1 / -1 / -1",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Text
          <ResizeHandlers componentId={component.id} />
        </div>
      </MantineText>
    );
  },
);
TextComponent.displayName = "Text";

export const Text = memo(TextComponent);
