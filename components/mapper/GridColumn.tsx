import { GridColumn as GridColumnBase } from "@/components/GridColumn";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useAppMode } from "@/hooks/useAppMode";
import { isSame } from "@/utils/componentComparison";
import { convertSizeToPx } from "@/utils/defaultSizes";
import { EditableComponentMapper } from "@/utils/editor";
import { BoxProps, MantineSize } from "@mantine/core";
import { forwardRef, memo } from "react";
import { useEditorTreeStore } from "@/stores/editorTree";

type Props = EditableComponentMapper & BoxProps;

const GridColumnComponent = forwardRef(
  (
    { renderTree, component, shareableContent, style, ...props }: Props,
    ref,
  ) => {
    const isLive = useEditorTreeStore((state) => state.isLive);
    const isPreviewMode = useEditorTreeStore((state) => state.isPreviewMode);
    // @ts-ignore
    const { gap, ...componentProps } = component.props;
    const gapPx = convertSizeToPx(gap as MantineSize, "gap");

    const shouldRemoveBorder = isLive || isPreviewMode;
    const { border, ...stylesRest } = style!;

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
        {...props}
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
