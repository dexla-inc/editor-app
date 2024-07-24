import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { setComponentBorder } from "@/utils/branding";
import { EditableComponentMapper } from "@/utils/editor";
import { FlexProps, Flex as MantineFlex } from "@mantine/core";
import merge from "lodash.merge";
import { forwardRef, memo } from "react";
import { useRenderData } from "@/hooks/components/useRenderData";
import { convertSizeToPx } from "@/utils/defaultSizes";

type Props = EditableComponentMapper & FlexProps;

export const ContainerComponent = forwardRef<HTMLDivElement, Props>(
  ({ renderTree, shareableContent, component, ...props }, ref) => {
    const {
      dataType = "static",
      data,
      triggers,
      ...componentProps
    } = component?.props ?? {};

    const defaultBorder = setComponentBorder(props.style);
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
        sx={merge({}, customStyle, {
          ".editor-mode &": defaultBorder,
        })}
        {...triggers}
        {...componentProps}
        key={props.id}
      >
        {renderData({ renderTree })}
      </MantineFlex>
    );
  },
);
ContainerComponent.displayName = "Container";

export const Container = memo(withComponentWrapper<Props>(ContainerComponent));
