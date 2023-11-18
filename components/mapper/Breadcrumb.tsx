import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import {
  BreadcrumbsProps,
  Breadcrumbs as MantineBreadcrumbs,
} from "@mantine/core";
import { memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & BreadcrumbsProps;

const BreadcrumbComponent = ({ renderTree, component, ...props }: Props) => {
  const { children, ...componentProps } = component.props as any;

  return (
    <MantineBreadcrumbs {...props} {...componentProps}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineBreadcrumbs>
  );
};

export const Breadcrumb = memo(BreadcrumbComponent, isSame);
