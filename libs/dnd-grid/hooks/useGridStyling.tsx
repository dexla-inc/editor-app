import { Component, ComponentTree } from "@/utils/editor";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useEditorStore } from "@/stores/editor";

type Props = {
  component: ComponentTree & Component;
};

export const useGridStyling = ({ component }: Props) => {
  const isSelected = useEditorTreeStore((state) =>
    state.selectedComponentIds?.includes(component.id ?? ""),
  );
  const isActive = useEditorStore(
    (state) => isSelected || state.hoverComponentId === component.id,
  );

  return {
    position: "relative",
    gridColumn: component.props?.style?.gridColumn,
    gridRow: component.props?.style?.gridRow,
    display: "grid",
    gridTemplateColumns: "subgrid",
    gridTemplateRows: "subgrid",
    padding: "0",
    overflow: "visible",
    ...(isActive && {
      boxShadow: "0 0 0 2px #3b82f6 inset",
    }),
    ...(component?.props?.bg && {
      backgroundColor: component.props.bg,
    }),
  };
};
