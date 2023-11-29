import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { AvatarProps, Avatar as MantineAvatar } from "@mantine/core";
import get from "lodash.get";
import { memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & AvatarProps;

const AvatarComponent = ({ renderTree, component, ...props }: Props) => {
  const isPreviewMode = component.isPreviewMode ?? false;

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
    <MantineAvatar {...props} {...componentProps} src={value}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineAvatar>
  );
};

export const Avatar = memo(AvatarComponent, isSame);
