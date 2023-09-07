import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import {
  Pagination as MantinePagination,
  PaginationProps,
} from "@mantine/core";
import { memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & PaginationProps;

const PaginationComponent = ({ renderTree, component, ...props }: Props) => {
  const componentProps = component.props as any;

  return <MantinePagination {...props} {...componentProps} />;
};

export const Pagination = memo(PaginationComponent, isSame);
