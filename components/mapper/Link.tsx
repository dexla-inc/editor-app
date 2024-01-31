import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useBindingPopover } from "@/hooks/useBindingPopover";
import { useBrandingStyles } from "@/hooks/useBrandingStyles";
import { useContentEditable } from "@/hooks/useContentEditable";
import { useData } from "@/hooks/useData";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { AnchorProps, Anchor as MantineAnchor } from "@mantine/core";
import merge from "lodash.merge";
import { forwardRef, memo, useEffect } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  shareableContent: any;
} & AnchorProps;

const LinkComponent = forwardRef(
  ({ renderTree, component, shareableContent, ...props }: Props, ref) => {
    const { triggers, variable, ...componentProps } = component.props as any;

    const contentEditableProps = useContentEditable(component.id as string);

    const { getSelectedVariable, handleValueUpdate } = useBindingPopover();
    const selectedVariable = getSelectedVariable(variable);
    const { fontSizeStyle } = useBrandingStyles();

    const customStyle = merge({}, props.style, {
      fontSize: props.style?.fontSize
        ? props.style.fontSize + "px"
        : fontSizeStyle.fontSize,
    });

    const { getValue } = useData();
    const childrenValue = getValue("children", { component, shareableContent });
    useEffect(() => {
      if (selectedVariable?.defaultValue === childrenValue) return;
      handleValueUpdate(component.id as string, selectedVariable);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedVariable]);

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
