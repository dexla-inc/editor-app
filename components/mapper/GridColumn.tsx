import { GridColumn as GridColumnBase } from "@/components/GridColumn";
import { useEditorStore } from "@/stores/editor";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { BoxProps } from "@mantine/core";
import { memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & BoxProps;

const GridColumnComponent = ({ renderTree, component, ...props }: Props) => {
  const theme = useEditorStore((state) => state.theme);

  const isLive = useEditorStore((state) => state.isLive);
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);
  // @ts-ignore
  const { style = {}, ...componentProps } = component.props;
  const { style: propsStyle = {}, ...propsRest } = props;
  const gap = propsStyle?.gap ? theme.spacing[propsStyle.gap as string] : 0;

  const styles = { ...style, ...propsStyle, gap };

  const shouldRemoveBorder = isLive || isPreviewMode;
  const { border, ...stylesRest } = styles;

  return (
    <GridColumnBase
      key={`${component.id}-${componentProps.span}`}
      style={{ ...stylesRest, border: shouldRemoveBorder ? "none" : border }}
      {...componentProps}
      {...propsRest}
      id={component.id}
    >
      {component.children &&
        component.children.length > 0 &&
        component.children?.map((child: any) => renderTree(child))}
    </GridColumnBase>
  );
};

export const GridColumn = memo(GridColumnComponent, isSame);
