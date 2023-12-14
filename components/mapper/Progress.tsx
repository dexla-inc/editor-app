import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { Progress as MantineProgress, ProgressProps } from "@mantine/core";
import { memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & ProgressProps;

const ProgressComponent = ({ renderTree, component, ...props }: Props) => {
  const { children, ...componentProps } = component.props as any;

  return (
    <MantineProgress {...props} {...componentProps} style={{ ...props.style }}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineProgress>
  );
};

export const Progress = memo(ProgressComponent, isSame);
