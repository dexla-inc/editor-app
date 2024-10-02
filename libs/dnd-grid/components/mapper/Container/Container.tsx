import { FlexProps, Flex as MantineFlex } from "@mantine/core";
import { forwardRef, memo } from "react";
import { EditableComponentMapper } from "../../../types/components";
import { useDnd } from "../../../hooks/useDnd";
import { useEditorStore } from "../../../stores/editor";
import { useShallow } from "zustand/react/shallow";
import { ResizeHandlers } from "../../ResizeHandlers";

type Props = EditableComponentMapper & FlexProps;

const ContainerComponent = forwardRef<HTMLDivElement, Props>(
  ({ component, onClick, renderTree }, ref) => {
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
      <MantineFlex
        id={component.id}
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
        ref={ref}
      >
        {component.children &&
          component.children.map((child) => renderTree(child))}
        <ResizeHandlers componentId={component.id} />
      </MantineFlex>
    );
  },
);
ContainerComponent.displayName = "Container";

export const Container = memo(ContainerComponent);
