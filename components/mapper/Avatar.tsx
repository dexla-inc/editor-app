import { useEditorStore } from "@/stores/editor";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { Avatar as MantineAvatar, AvatarProps } from "@mantine/core";
import get from "lodash.get";
import { forwardRef, memo } from "react";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";

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
      ...componentProps
    } = component.props as any;

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
