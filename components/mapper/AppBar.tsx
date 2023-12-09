// AppBar.tsx
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { memo } from "react";
import { Grid, GridProps } from "./Grid";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & GridProps; // Using GridProps instead of FlexProps

const AppBarComponent = ({ renderTree, component, ...props }: Props) => {
  const { children, ...componentProps } = component.props as any;

  return <Grid renderTree={renderTree} component={component} props={props} />;
};

export const AppBar = memo(AppBarComponent, isSame);
