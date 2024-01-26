import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { useBindingPopover } from "@/hooks/useBindingPopover";
import { Avatar as MantineAvatar, AvatarProps } from "@mantine/core";
import { forwardRef, memo, useEffect } from "react";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useData } from "@/hooks/useData";

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

    const { getSelectedVariable, handleValuesUpdate } = useBindingPopover();
    const sourceVariable = getSelectedVariable(srcValue);
    const altTextVariable = getSelectedVariable(childrenValue);

    const isVariablesSame =
      sourceVariable?.defaultValue === srcValue &&
      altTextVariable?.defaultValue === childrenValue;

    useEffect(() => {
      if (isVariablesSame) return;
      handleValuesUpdate(component.id as string, {
        src: sourceVariable?.defaultValue,
        children: altTextVariable?.defaultValue,
      });
    }, [sourceVariable, altTextVariable]);

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
