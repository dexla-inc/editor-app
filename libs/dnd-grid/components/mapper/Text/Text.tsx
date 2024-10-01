import { FlexProps, Text as MantineText } from "@mantine/core";
import { forwardRef, memo } from "react";
import { EditableComponentMapper } from "../../../types/components";
import { useDnd } from "../../../hooks/useDnd";
import { useEditorStore } from "../../../stores/editor";
import { useShallow } from "zustand/react/shallow";
import { useResize } from "../../../hooks/useResize";
import { ResizeHandlers } from "../../ResizeHandlers";

type Props = EditableComponentMapper & FlexProps;

const TextComponent = forwardRef<HTMLDivElement, Props>(
  ({ component, onClick }, ref) => {
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
      <MantineText
        id={component.id}
        draggable
        {...dragTriggers}
        onClick={(e) => {
          e.stopPropagation();
          onClick(component.id);
        }}
        className={`relative border rounded ${component?.props?.bg} component ${
          isActive ? "ring-2 ring-blue-500 ring-inset" : ""
        }`}
        style={{
          gridColumn: component.props?.style.gridColumn,
          gridRow: component.props?.style.gridRow,
          display: "grid",
          gridTemplateColumns: "subgrid",
          gridTemplateRows: "subgrid",
        }}
        styles={{
          inner: {
            display: "flex",
            gridArea: "1 / 1 / -1 / -1",
          },
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
        <div
          style={{
            display: "flex",
            gridArea: "1 / 1 / -1 / -1",
            justifyContent: "center",
          }}
        >
          Text
          <>
            {validComponent === component.id && (
              <div className="absolute inset-0 bg-blue-500 bg-opacity-30 pointer-events-none z-10" />
            )}
            {invalidComponent === component.id && (
              <div className="absolute inset-0 bg-red-500 bg-opacity-30 pointer-events-none z-10" />
            )}
            {isActive && <ResizeHandlers componentId={component.id} />}
          </>
        </div>
      </MantineText>
    );
  },
);
TextComponent.displayName = "Text";

export const Text = memo(TextComponent);
