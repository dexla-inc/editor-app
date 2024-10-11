import { FlexProps, Flex as MantineFlex } from "@mantine/core";
import { forwardRef, memo } from "react";
import { EditableComponentMapper } from "@/utils/editor";
import { useDnd } from "@/libs/dnd-grid/hooks/useDnd";
import { useDndGridStore } from "@/libs/dnd-grid/stores/dndGridStore";
import { useShallow } from "zustand/react/shallow";
import { ResizeHandlers } from "@/libs/dnd-grid/components/ResizeHandlers";
import { useEditorTreeStore } from "@/stores/editorTree";

type Props = EditableComponentMapper & FlexProps;

const ContainerComponent = forwardRef<HTMLDivElement, Props>(
  ({ component, renderTree }, ref) => {
    const { triggers } = component.props!;
    const dragTriggers = useDnd();
    const isSelected = useEditorTreeStore((state) =>
      state.selectedComponentIds?.includes(component.id ?? ""),
    );
    const isActive = useDndGridStore(
      (state) => isSelected || state.hoverComponentId === component.id,
    );
    const { setHoverComponentId } = useDndGridStore(
      useShallow((state) => state),
    );

    return (
      <MantineFlex
        id={component.id}
        draggable
        {...dragTriggers}
        {...triggers}
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
        {component.children &&
          component.children.map((child) => renderTree(child))}
        <ResizeHandlers componentId={component.id} />
      </MantineFlex>
    );
  },
);
ContainerComponent.displayName = "Container";

export const Container = memo(ContainerComponent);
