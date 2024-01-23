import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { useBindingPopover } from "@/hooks/useBindingPopover";
import { useEditorStore } from "@/stores/editor";
import { Avatar as MantineAvatar, AvatarProps } from "@mantine/core";
import { forwardRef, memo, useEffect } from "react";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import get from "lodash.get";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  shareableContent?: any;
} & AvatarProps;

const AvatarComponent = forwardRef(
  ({ renderTree, component, shareableContent, ...props }: Props, ref) => {
    const { src, children, triggers, data, dataType, ...componentProps } =
      component.props as any;

    const { srcKey, childrenKey } = component.onLoad ?? {};

    const srcValue =
      dataType === "dynamic" ? shareableContent.data?.[srcKey] : src;
    const childrenValue =
      dataType === "dynamic" ? shareableContent.data?.[childrenKey] : children;

      const { getSelectedVariable, handleValuesUpdate } = useBindingPopover();
      const sourceVariable = getSelectedVariable(srcKey);
      const altTextVariable = getSelectedVariable(childrenKey);

      const isVariablesSame =
          sourceVariable?.defaultValue === src &&
          altTextVariable?.defaultValue === children;

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
