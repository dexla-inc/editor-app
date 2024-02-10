import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { ButtonProps, Button as MantineCountdownButton } from "@mantine/core";
import { ReactElement, forwardRef, memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  isPreviewMode: boolean;
  shareableContent: any;
} & ButtonProps &
  ReactElement<"Button">;

export const CountdownButtonComponent = forwardRef(({}: Props, ref) => {
  return <MantineCountdownButton></MantineCountdownButton>;
});

CountdownButtonComponent.displayName = "CountdownButton";

export const CountdownButton = memo(
  withComponentWrapper<Props>(CountdownButtonComponent),
  isSame,
);
