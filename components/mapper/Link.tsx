import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { AnchorProps, Anchor as MantineAnchor } from "@mantine/core";
import { forwardRef, memo } from "react";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & AnchorProps;

const LinkComponent = forwardRef(
  ({ renderTree, component, ...props }: Props, ref) => {
    const { children, triggers, ...componentProps } = component.props as any;

    return (
      <MantineAnchor ref={ref} {...props} {...componentProps} {...triggers}>
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
