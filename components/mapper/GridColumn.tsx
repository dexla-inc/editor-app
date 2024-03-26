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
  ({ renderTree, component, shareableContent, ...props }: Props, ref) => {
    const isLive = useEditorTreeStore((state) => state.isLive);
    const isPreviewMode = useEditorTreeStore((state) => state.isPreviewMode);
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
