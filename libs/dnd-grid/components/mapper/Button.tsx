import { ButtonProps, Button as MantineButton } from "@mantine/core";
import { ReactElement, forwardRef, memo } from "react";
import { EditableComponentMapper } from "@/utils/editor";
import { useDnd } from "@/libs/dnd-grid/hooks/useDnd";
import { useDndGridStore } from "@/libs/dnd-grid/stores/dndGridStore";
import { useShallow } from "zustand/react/shallow";
import { ResizeHandlers } from "@/libs/dnd-grid/components/ResizeHandlers";
import { useGridStyling } from "@/libs/dnd-grid/hooks/useGridStyling";

type Props = EditableComponentMapper & ButtonProps & ReactElement<"Button">;

const ButtonComponent = forwardRef<HTMLButtonElement, Props>(
  ({ component }, ref) => {
    const { triggers } = component.props!;
    const dragTriggers = useDnd();
    const gridStyling = useGridStyling({ component });
    const { setHoverComponentId } = useDndGridStore(
      useShallow((state) => state),
    );

    return (
      <MantineButton
        id={component.id}
        draggable
        {...dragTriggers}
        {...triggers}
        style={{
          ...gridStyling,
        }}
        styles={{
          inner: {
            display: "flex",
            gridArea: "1 / 1 / -1 / -1",
          },
        }}
        onMouseOver={(e) => {
          e.stopPropagation();
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
        Button
        <ResizeHandlers componentId={component.id} />
      </MantineButton>
    );
  },
);
ButtonComponent.displayName = "Button";

export const Button = memo(ButtonComponent);
