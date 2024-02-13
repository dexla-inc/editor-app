import { GridColumn as GridColumnBase } from "@/components/GridColumn";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useAppMode } from "@/hooks/useAppMode";
import { useEditorStore } from "@/stores/editor";
import { isSame } from "@/utils/componentComparison";
import { convertSizeToPx } from "@/utils/defaultSizes";
import { Component } from "@/utils/editor";
import { BoxProps, MantineSize } from "@mantine/core";
import { forwardRef, memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & BoxProps;

const GridColumnComponent = forwardRef(
  ({ renderTree, component, ...props }: Props, ref) => {
    const isLive = useEditorStore((state) => state.isLive);
    const isPreviewMode = useAppMode();
    // @ts-ignore
    const { style = {}, gap, ...componentProps } = component.props;
    const { style: propsStyle = {}, ...propsRest } = props;
    const gapPx = convertSizeToPx(gap as MantineSize, "gap");

    const styles = { ...style, ...propsStyle };

    const shouldRemoveBorder = isLive || isPreviewMode;
    const { border, ...stylesRest } = styles;

    return (
      <GridColumnBase
        ref={ref}
        key={`${component.id}-${componentProps.span}`}
        style={{
          ...stylesRest,
          gap: gapPx,
          border: shouldRemoveBorder ? "none" : border,
        }}
        {...componentProps}
        {...propsRest}
        id={component.id}
      >
        {component.children &&
          component.children.length > 0 &&
          component.children?.map((child: any) => renderTree(child))}
      </GridColumnBase>
    );
  },
);

GridColumnComponent.displayName = "GridColumn";

export const GridColumn = memo(
  withComponentWrapper<Props>(GridColumnComponent),
  isSame,
);
