import { AlertProps, Alert as MantineAlert } from "@mantine/core";
import { forwardRef, memo } from "react";
import { useDnd } from "@/libs/dnd-grid/hooks/useDnd";
import { useDndGridStore } from "@/libs/dnd-grid/stores/dndGridStore";
import { useShallow } from "zustand/react/shallow";
import { ResizeHandlers } from "@/libs/dnd-grid/components/ResizeHandlers";
import { EditableComponentMapper } from "@/utils/editor";

type Props = EditableComponentMapper & Omit<AlertProps, "title">;

const AlertComponent = forwardRef<HTMLDivElement, Props>(
  ({ component, renderTree }, ref) => {
    const { triggers } = component.props!;
    const dragTriggers = useDnd();
    const isActive = useDndGridStore(
      (state) =>
        state.selectedComponentId === component.id ||
        state.hoverComponentId === component.id,
    );
    const { setHoverComponentId } = useDndGridStore(
      useShallow((state) => state),
    );

    return (
      <MantineAlert
        id={component.id}
        ref={ref}
        draggable
        {...dragTriggers}
        {...triggers}
        style={{
          overflow: "visible",
          position: "relative",
          border: "1px solid",
          borderRadius: "0.25rem",
          gridColumn: component.props?.style.gridColumn,
          gridRow: component.props?.style.gridRow,
          display: "grid",
          gridTemplateColumns: "subgrid",
          gridTemplateRows: "subgrid",
          ...(isActive && {
            boxShadow: "0 0 0 2px #3b82f6 inset",
          }),
          ...(component?.props?.bg && {
            backgroundColor: component.props.bg,
          }),
        }}
        styles={{
          wrapper: {
            display: "grid",
            gridTemplateColumns: "subgrid",
            gridTemplateRows: "subgrid",
            gridArea: "1 / 1 / -1 / -1",
          },
          icon: {
            margin: "0px",
          },
          body: {
            display: "grid",
            gridTemplateColumns: "subgrid",
            gridTemplateRows: "subgrid",
            gridArea: "1 / 1 / -1 / -1",
          },
          message: {
            display: "grid",
            gridTemplateColumns: "subgrid",
            gridTemplateRows: "subgrid",
            gridArea: "1 / 1 / -1 / -1",
          },
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
        {component.children &&
          component.children.map((child) => renderTree(child))}
        <ResizeHandlers componentId={component.id} />
      </MantineAlert>
    );
  },
);
AlertComponent.displayName = "Alert";

export const Alert = memo(AlertComponent);
