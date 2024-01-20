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
} & AnchorProps;

const LinkComponent = forwardRef(
  ({ renderTree, component, ...props }: Props, ref) => {
    const { children, triggers, variable, ...componentProps } =
      component.props as any;

    const { getSelectedVariable, handleValueUpdate } = useBindingPopover();
    const selectedVariable = getSelectedVariable(variable);

    useEffect(() => {
      if (selectedVariable?.defaultValue === children) return;
      handleValueUpdate(component.id as string, selectedVariable);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedVariable]);

    const contentEditable = useContentEditable(component.id as string);

    return (
      <MantineAnchor
        {...contentEditable}
        {...props}
        {...componentProps}
        {...triggers}
      >
        {component.children && component.children.length > 0
          ? component.children?.map((child) =>
              renderTree({
                ...child,
                props: { ...child.props, ...triggers },
              }),
            )
          : children}
      </MantineAnchor>
    );
  },
);
LinkComponent.displayName = "Link";

export const Link = memo(withComponentWrapper<Props>(LinkComponent), isSame);
