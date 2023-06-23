import { Component } from "@/utils/editor";
import { Rating as MantineRating, RatingProps } from "@mantine/core";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & RatingProps;

export const Rating = ({ renderTree, component, ...props }: Props) => {
  const componentProps = component.props as any;

  return <MantineRating {...props} {...componentProps} />;
};
