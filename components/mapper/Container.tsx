import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useRenderData } from "@/hooks/components/useRenderData";
import { convertSizeToPx } from "@/utils/defaultSizes";
import { EditableComponentMapper } from "@/utils/editor";
import { FlexProps, Flex as MantineFlex } from "@mantine/core";
import merge from "lodash.merge";
import { forwardRef, memo } from "react";

type Props = EditableComponentMapper & FlexProps;

export const ContainerComponent = forwardRef<HTMLDivElement, Props>(
  (
    { renderTree, shareableContent, component, ChildrenWrapper, ...props },
    ref,
  ) => {
    const {
      dataType = "static",
      data,
      triggers,
      ...componentProps
    } = component?.props ?? {};

    const gapPx = convertSizeToPx(component?.props?.gap, "gap");
    const customStyle = merge({ width: "100%" }, props.style, {
      gap: gapPx,
    });

    const { renderData } = useRenderData({
      component,
      shareableContent,
    });

    return (
      <MantineFlex
        ref={ref}
        {...props}
        style={customStyle}
        {...triggers}
        {...componentProps}
        key={props.id}
      >
        <ChildrenWrapper>{renderData({ renderTree })}</ChildrenWrapper>
      </MantineFlex>
    );
  },
);
ContainerComponent.displayName = "Container";

export const Container = memo(withComponentWrapper<Props>(ContainerComponent));
