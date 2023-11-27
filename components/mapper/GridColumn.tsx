import { Component } from "@/utils/editor";
import { BoxProps } from "@mantine/core";
import { GridColumn as GridColumnComponent } from "@/components/GridColumn";
import { useEditorStore } from "@/stores/editor";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & BoxProps;

export const GridColumn = ({
  renderTree,
  component,
  children,
  ...props
}: Props) => {
  const isLive = useEditorStore((state) => state.isLive);
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);
  // @ts-ignore
  const { style = {}, ...componentProps } = component.props;
  const { style: propsStyle = {}, ...propsRest } = props;
  const styles = { ...style, ...propsStyle };

  const shouldRemoveBorder = isLive || isPreviewMode;
  const { border, ...stylesRest } = styles;

  return (
    <GridColumnComponent
      style={{ ...stylesRest, border: shouldRemoveBorder ? "none" : border }}
      {...componentProps}
      {...propsRest}
      id={component.id}
    >
      {children}
      {component.children &&
        component.children.length > 0 &&
        component.children?.map((child: any) => renderTree(child))}
    </GridColumnComponent>
  );
};
