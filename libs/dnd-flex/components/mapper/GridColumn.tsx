import { GridColumn as GridColumnBase } from "@/components/GridColumn";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { convertSizeToPx } from "@/utils/defaultSizes";
import { EditableComponentMapper } from "@/utils/editor";
import { BoxProps, MantineSize } from "@mantine/core";
import { forwardRef, memo } from "react";

type Props = EditableComponentMapper & BoxProps;

const GridColumnComponent = forwardRef(
  (
    { renderTree, component, shareableContent, style, ...props }: Props,
    ref,
  ) => {
    // @ts-ignore
    const { gap, triggers, ...componentProps } = component.props;
    const gapPx = convertSizeToPx(gap as MantineSize, "gap");

    return (
      <GridColumnBase
        key={`${props.id}-${componentProps.span}`}
        style={{
          ...style,
          gap: gapPx,
        }}
        {...componentProps}
        {...props}
        id={component.id}
        onClick={triggers?.onClick}
      >
        {component.children &&
          component.children.length > 0 &&
          component.children?.map((child: any) =>
            renderTree(child, shareableContent),
          )}
      </GridColumnBase>
    );
  },
);

GridColumnComponent.displayName = "GridColumn";

export const GridColumn = memo(
  withComponentWrapper<Props>(GridColumnComponent),
);
