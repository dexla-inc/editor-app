import { Component } from "@/utils/editor";
import { Image as MantineImage, ImageProps } from "@mantine/core";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & ImageProps;

export const Image = ({ renderTree, component, ...props }: Props) => {
  const {
    style: { width, height, ...style },
    ...componentProps
  } = component.props as any;

  return (
    <MantineImage
      {...props}
      {...componentProps}
      width={width}
      height={height}
      style={style}
    />
  );
};
