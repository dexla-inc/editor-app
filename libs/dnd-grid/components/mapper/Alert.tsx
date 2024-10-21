import { AlertProps, Alert as MantineAlert } from "@mantine/core";
import { forwardRef, memo } from "react";
import { useDnd } from "@/libs/dnd-grid/hooks/useDnd";
import { useDndGridStore } from "@/libs/dnd-grid/stores/dndGridStore";
import { useShallow } from "zustand/react/shallow";
import { ResizeHandlers } from "@/libs/dnd-grid/components/ResizeHandlers";
import { EditableComponentMapper } from "@/utils/editor";
import { useGridStyling } from "@/libs/dnd-grid/hooks/useGridStyling";

type Props = EditableComponentMapper & Omit<AlertProps, "title">;

const AlertComponent = forwardRef<HTMLDivElement, Props>(
  ({ component, renderTree }, ref) => {
    const { triggers } = component.props!;
    const dragTriggers = useDnd();

    const gridStyling = useGridStyling({ component });

    return (
      <MantineAlert
        id={component.id}
        ref={ref}
        draggable
        {...dragTriggers}
        {...triggers}
        style={{
          ...gridStyling,
          padding: 0,
        }}
        styles={mantineStyles}
      >
        {component.children &&
          component.children.map((child) => renderTree(child))}
        <ResizeHandlers componentId={component.id} />
      </MantineAlert>
    );
  },
);

const commonGridStyle = {
  display: "grid",
  gridTemplateColumns: "subgrid",
  gridTemplateRows: "subgrid",
  gridArea: "1 / 1 / -1 / -1",
};

const mantineStyles = {
  wrapper: commonGridStyle,
  icon: {
    margin: "0px",
  },
  body: commonGridStyle,
  message: commonGridStyle,
};

AlertComponent.displayName = "Alert";

export const Alert = memo(AlertComponent);
