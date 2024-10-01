import { FlexProps, Flex as MantineFlex } from "@mantine/core";
import { forwardRef, memo } from "react";
import { EditableComponentMapper } from "../../../types/components";
import { useDnd } from "../../../hooks/useDnd";
// import { useResize } from 'hooks/useResize.tsx';
import { useEditorStore } from "../../../stores/editor";
import { useResize } from "../../../hooks/useResize";
import { useShallow } from "zustand/react/shallow";
import { ResizeHandlers } from "../../ResizeHandlers";

type Props = EditableComponentMapper & FlexProps;

const ContainerComponent = forwardRef<HTMLDivElement, Props>(
  ({ component, onClick, renderTree }, ref) => {
    const { handleResizeStart } = useResize();
    const dragTriggers = useDnd();
    const isActive = useEditorStore(
      (state) =>
        state.selectedComponentId === component.id ||
        state.hoverComponentId === component.id,
    );
    const { validComponent, invalidComponent, setHoverComponentId } =
      useEditorStore(useShallow((state) => state));

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
          borderRadius: "4px",
          backgroundColor: component?.props?.bg,
          gridColumn: component.props?.style.gridColumn,
          gridRow: component.props?.style.gridRow,
          display: "grid",
          gridTemplateColumns: "subgrid",
          gridTemplateRows: "subgrid",
          ...(isActive && {
            boxShadow: "inset 0 0 0 2px #3b82f6",
          }),
        }}
        onMouseOver={(e) => {
          e.stopPropagation();
          setHoverComponentId(component.id);
        }}
        onMouseLeave={(e) => {
          e.stopPropagation();
          setHoverComponentId(null);
        }}
        ref={ref}
      >
        {component.children &&
          component.children.map((child) => renderTree(child))}
        {validComponent === component.id && (
          <div
            style={{
              position: "absolute",
              inset: "0",
              backgroundColor: "rgba(59, 130, 246, 0.3)", // bg-blue-500 with 30% opacity
              pointerEvents: "none",
              zIndex: 10,
            }}
          />
        )}
        {invalidComponent === component.id && (
          <div
            style={{
              position: "absolute",
              inset: "0",
              backgroundColor: "rgba(239, 68, 68, 0.3)", // bg-red-500 with 30% opacity
              pointerEvents: "none",
              zIndex: 10,
            }}
          />
        )}
        {isActive && <ResizeHandlers componentId={component.id} />}
      </MantineFlex>
    );
  },
);
ContainerComponent.displayName = "Container";

export const Container = memo(ContainerComponent);
