import { Component } from "@/utils/editor";
import { ImageProps } from "@mantine/core";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & ImageProps;

export const Image = ({ renderTree, component, ...props }: Props) => {
  const {
    style: { width, height, alt, ...style },
    triggers,
    ...componentProps
  } = component.props as any;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt || "Image"}
      {...props}
      {...componentProps}
      {...triggers}
      width={width}
      height={height}
      style={style}
    />
  );
};
