import { CardAndContainerWrapper } from "@/components/mapper/CardAndContainerWrapper";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { setComponentBorder } from "@/utils/branding";
import { EditableComponentMapper } from "@/utils/editor";
import { FlexProps } from "@mantine/core";
import merge from "lodash.merge";
import { forwardRef, memo } from "react";
import { isSame } from "@/utils/componentComparison";

type Props = EditableComponentMapper & FlexProps;

export const ContainerComponent = forwardRef(
  (
    { renderTree, shareableContent, component, isPreviewMode, ...props }: Props,
    ref,
  ) => {
    const defaultBorder = setComponentBorder(props.style, isPreviewMode);
    const customStyle = merge({ width: "100%" }, props.style, defaultBorder);

    return (
      <CardAndContainerWrapper
        ref={ref}
        renderTree={renderTree}
        component={component}
        {...props}
        style={customStyle}
        shareableContent={shareableContent}
      />
    );
  },
);
ContainerComponent.displayName = "Container";

export const Container = memo(
  withComponentWrapper<Props>(ContainerComponent),
  isSame,
);
