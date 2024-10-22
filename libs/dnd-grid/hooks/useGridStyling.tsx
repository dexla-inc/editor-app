import { Component, ComponentTree } from "@/utils/editor";
import { useDndGridStore } from "@/libs/dnd-grid/stores/dndGridStore";
import { useEditorTreeStore } from "@/stores/editorTree";

type Props = {
  component: ComponentTree & Component;
};

export const useGridStyling = ({ component }: Props) => {
  const isSelected = useEditorTreeStore((state) =>
    state.selectedComponentIds?.includes(component.id ?? ""),
  );
  const isActive = useDndGridStore(
    (state) => isSelected || state.hoverComponentId === component.id,
  );

  return {
    position: "relative",
    border: "1px solid",
    borderRadius: "0.25rem",
    gridColumn: component.props?.style?.gridColumn,
    gridRow: component.props?.style?.gridRow,
    display: "grid",
    gridTemplateColumns: "subgrid",
    gridTemplateRows: "subgrid",
    padding: "0",
    ...(isActive && {
      boxShadow: "0 0 0 2px #3b82f6 inset",
    }),
    ...(component?.props?.bg && {
      backgroundColor: component.props.bg,
    }),
  };
};
