import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { Rating as MantineRating, RatingProps } from "@mantine/core";
import { memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & RatingProps;

const RatingComponent = ({ renderTree, component, ...props }: Props) => {
  const componentProps = component.props as any;

  return <MantineRating {...props} {...componentProps} />;
};

export const Rating = memo(RatingComponent, isSame);
