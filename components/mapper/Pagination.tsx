import { Component } from "@/utils/editor";
import {
  Pagination as MantinePagination,
  PaginationProps,
} from "@mantine/core";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & PaginationProps;

export const Pagination = ({ renderTree, component, ...props }: Props) => {
  const componentProps = component.props as any;

  return <MantinePagination {...props} {...componentProps} />;
};
