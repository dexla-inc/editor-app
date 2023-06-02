import { Component } from "@/utils/editor";
import {
  Breadcrumbs as MantineBreadcrumbs,
  BreadcrumbsProps,
} from "@mantine/core";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & BreadcrumbsProps;

export const Breadcrumb = ({ renderTree, component, ...props }: Props) => {
  const { children, ...componentProps } = component.props as any;

  return (
    <MantineBreadcrumbs {...props} {...componentProps}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineBreadcrumbs>
  );
};
