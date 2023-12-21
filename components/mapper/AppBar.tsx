// AppBar.tsx
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { forwardRef, memo } from "react";
import { Grid, GridProps } from "./Grid";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & GridProps; // Using GridProps instead of FlexProps

const AppBarComponent = forwardRef(
  ({ renderTree, component, ...props }: Props, ref) => {
    const { children, ...componentProps } = component.props as any;

    return (
      <Grid
        ref={ref}
        renderTree={renderTree}
        component={component}
        props={props}
      />
    );
  },
);
AppBarComponent.displayName = "AppBar";

export const AppBar = memo(
  withComponentWrapper<Props>(AppBarComponent),
  isSame,
);
