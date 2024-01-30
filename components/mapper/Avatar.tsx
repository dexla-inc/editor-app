import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useData } from "@/hooks/useData";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { AvatarProps, Avatar as MantineAvatar } from "@mantine/core";
import { forwardRef, memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  shareableContent?: any;
} & AvatarProps;

const AvatarComponent = forwardRef(
  ({ renderTree, component, shareableContent, ...props }: Props, ref) => {
    const { triggers, data, ...componentProps } = component.props as any;

    const { getValue } = useData();
    const srcValue = getValue("src", { component, shareableContent });
    const childrenValue = getValue("children", { component, shareableContent });

    return (
      <MantineAvatar ref={ref} {...props} {...componentProps} src={srcValue}>
        {component.children && component.children.length > 0
          ? component.children?.map((child) => renderTree(child))
          : childrenValue}
      </MantineAvatar>
    );
  },
);
AvatarComponent.displayName = "Avatar";

export const Avatar = memo(
  withComponentWrapper<Props>(AvatarComponent),
  isSame,
);
