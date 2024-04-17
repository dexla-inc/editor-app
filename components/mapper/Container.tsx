import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { setComponentBorder } from "@/utils/branding";
import { EditableComponentMapper } from "@/utils/editor";
import { FlexProps, Flex as MantineFlex } from "@mantine/core";
import merge from "lodash.merge";
import { forwardRef, memo } from "react";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useRenderData } from "@/hooks/useRenderData";
import { convertSizeToPx } from "@/utils/defaultSizes";

type Props = EditableComponentMapper & FlexProps;

export const ContainerComponent = forwardRef<HTMLDivElement, Props>(
  ({ renderTree, shareableContent, component, ...props }, ref) => {
    const isPreviewMode = useEditorTreeStore(
      (state) => state.isPreviewMode || state.isLive,
    );

    const { dataType, data, triggers, ...componentProps } =
      component?.props ?? {};

    const defaultBorder = setComponentBorder(props.style, isPreviewMode);
    const gapPx = convertSizeToPx(component?.props?.gap, "gap");
    const customStyle = merge({ width: "100%" }, props.style, defaultBorder, {
      gap: gapPx,
    });

    const { renderData } = useRenderData({ component });

    return (
      <MantineFlex
        ref={ref}
        {...props}
        style={customStyle}
        {...triggers}
        {...componentProps}
      >
        {renderData({ renderTree, shareableContent })}
      </MantineFlex>
    );
  },
);
ContainerComponent.displayName = "Container";

export const Container = memo(withComponentWrapper<Props>(ContainerComponent));
