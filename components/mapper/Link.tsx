import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useBrandingStyles } from "@/hooks/useBrandingStyles";
import { useContentEditable } from "@/hooks/useContentEditable";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { AnchorProps, Anchor as MantineAnchor } from "@mantine/core";
import merge from "lodash.merge";
import { forwardRef, memo } from "react";
import { useDataContext } from "@/contexts/DataProvider";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  shareableContent: any;
} & AnchorProps;

const LinkComponent = forwardRef(
  ({ renderTree, component, shareableContent, ...props }: Props, ref) => {
    const { triggers, variable, ...componentProps } = component.props as any;

    const contentEditableProps = useContentEditable(component.id as string);

    const { computeValue } = useDataContext()!;
    const childrenValue =
      computeValue({
        value: component.onLoad.children,
        shareableContent,
      }) ?? component.props?.children;

    const { fontSizeStyle } = useBrandingStyles();

    const customStyle = merge({}, props.style, {
      fontSize: props.style?.fontSize
        ? props.style.fontSize + "px"
        : fontSizeStyle.fontSize,
    });

    return (
      <MantineAnchor
        {...contentEditableProps}
        {...props}
        {...componentProps}
        {...triggers}
        ref={ref ?? contentEditableProps.ref}
        style={customStyle}
      >
        {childrenValue}
      </MantineAnchor>
    );
  },
);
LinkComponent.displayName = "Link";

export const Link = memo(withComponentWrapper<Props>(LinkComponent), isSame);
