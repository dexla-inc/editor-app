import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useBindingPopover } from "@/hooks/useBindingPopover";
import { useEditorStore } from "@/stores/editor";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { AvatarProps, Avatar as MantineAvatar } from "@mantine/core";
import get from "lodash.get";
import { forwardRef, memo, useEffect } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & AvatarProps;

const AvatarComponent = forwardRef(
  ({ renderTree, component, ...props }: Props, ref) => {
    const isPreviewMode = useEditorStore((state) => state.isPreviewMode);

    const {
      src,
      children,
      triggers,
      data,
      repeatedIndex,
      dataPath,
      childrenKey,
      srcKey,
      ...componentProps
    } = component.props as any;

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

    let value = isPreviewMode ? data?.value ?? src : src;

    if (isPreviewMode && typeof repeatedIndex !== "undefined" && dataPath) {
      const path = dataPath.replaceAll("[0]", `[${repeatedIndex}]`);
      value = get(data?.base ?? {}, path) ?? src;
    }

    return (
      <MantineAvatar ref={ref} {...props} {...componentProps} src={value}>
        {component.children && component.children.length > 0
          ? component.children?.map((child) => renderTree(child))
          : children}
      </MantineAvatar>
    );
  },
);
AvatarComponent.displayName = "Avatar";

export const Avatar = memo(
  withComponentWrapper<Props>(AvatarComponent),
  isSame,
);
