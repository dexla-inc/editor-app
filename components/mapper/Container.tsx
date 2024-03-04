import { CardAndContainerWrapper } from "@/components/mapper/CardAndContainerWrapper";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { setComponentBorder } from "@/utils/branding";
import { EditableComponentMapper } from "@/utils/editor";
import { FlexProps } from "@mantine/core";
import merge from "lodash.merge";
import { forwardRef } from "react";

type Props = EditableComponentMapper & FlexProps;

export const ContainerComponent = forwardRef(
  ({ renderTree, component, isPreviewMode, ...props }: Props, ref) => {
    const defaultBorder = setComponentBorder(props.style, isPreviewMode);
    const customStyle = merge({ width: "100%" }, props.style, defaultBorder);

    return (
      <CardAndContainerWrapper
        ref={ref}
        renderTree={renderTree}
        component={component}
        {...props}
        style={customStyle}
        shareableContent={props.shareableContent}
      />
    );
  },
);
ContainerComponent.displayName = "Container";

export const Container = withComponentWrapper<Props>(ContainerComponent);
