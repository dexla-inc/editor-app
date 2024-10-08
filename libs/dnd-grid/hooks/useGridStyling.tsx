import { Component, ComponentTree } from "@/utils/editor";
import { useEditorStore } from "@/libs/dnd-grid/stores/editor";

type Props = {
  component: ComponentTree & Component;
};

export const useGridStyling = ({ component }: Props) => {
  const isActive = useEditorStore(
    (state) =>
      state.selectedComponentId === component.id ||
      state.hoverComponentId === component.id,
  );

  return {
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
  };
};
