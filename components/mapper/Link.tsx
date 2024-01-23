import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useBindingPopover } from "@/hooks/useBindingPopover";
import { useContentEditable } from "@/hooks/useContentEditable";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { AnchorProps, Anchor as MantineAnchor } from "@mantine/core";
import { forwardRef, memo, useEffect } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  shareableContent: any;
} & AnchorProps;

const LinkComponent = forwardRef(
  ({ renderTree, component, shareableContent, ...props }: Props, ref) => {
    const { children, triggers, dataType, variable, ...componentProps } =
      component.props as any;

    const contentEditable = useContentEditable(component.id as string);

      const { getSelectedVariable, handleValueUpdate } = useBindingPopover();
      const selectedVariable = getSelectedVariable(variable);

      useEffect(() => {
          if (selectedVariable?.defaultValue === children) return;
          handleValueUpdate(component.id as string, selectedVariable);
          // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [selectedVariable]);

    const { childrenKey } = component.onLoad ?? {};
    const childrenValue =
      dataType === "dynamic" ? shareableContent.data?.[childrenKey] : children;

    return (
      <MantineAnchor
        {...contentEditable}
        {...props}
        {...componentProps}
        {...triggers}
        ref={ref}
      >
        {childrenValue}
      </MantineAnchor>
    );
  },
);
LinkComponent.displayName = "Link";

export const Link = memo(withComponentWrapper<Props>(LinkComponent), isSame);
