import { EditableComponentMapper } from "../../../types/components";
import { AlertProps, Alert as MantineAlert } from "@mantine/core";
import { forwardRef, memo } from "react";
import { useDnd } from "../../../hooks/useDnd";
import { useEditorStore } from "../../../stores/editor";
import { useShallow } from "zustand/react/shallow";
import { ResizeHandlers } from "../../ResizeHandlers";

type Props = EditableComponentMapper & Omit<AlertProps, "title">;

const AlertComponent = forwardRef(
  ({ renderTree, onClick, component }: Props, ref) => {
    const dragTriggers = useDnd();
    const isActive = useEditorStore(
      (state) =>
        state.selectedComponentId === component.id ||
        state.hoverComponentId === component.id,
    );
    const { setHoverComponentId } = useEditorStore(
      useShallow((state) => state),
    );

    return (
      <MantineAlert
        //ref={ref}
        draggable
        {...dragTriggers}
        onClick={(e) => {
          e.stopPropagation();
          onClick(component.id);
        }}
        style={{
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
            display: "flex",
            gridArea: "1 / 1 / -1 / -1",
          },
          icon: {
            margin: "0px",
          },
          body: {
            width: "100%",
            height: "100%",
          },
          message: {
            width: "100%",
            height: "100%",
            display: "grid",
            gridArea: "1 / 1 / -1 / -1",
          },
        }}
        onMouseOver={(e) => {
          const { hoverComponentId } = useEditorStore.getState();
          if (hoverComponentId !== component.id) {
            setHoverComponentId(component.id);
          }
        }}
        onMouseLeave={(e) => {
          e.stopPropagation();
          const { hoverComponentId } = useEditorStore.getState();
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
