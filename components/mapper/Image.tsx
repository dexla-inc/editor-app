import { Component } from "@/utils/editor";
import { ImageProps, Image as MantineImage } from "@mantine/core";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & ImageProps;

export const Image = ({ renderTree, component, ...props }: Props) => {
  const {
    alt = "Image",
    src,
    style: { width, height, ...style },
    triggers,
    ...componentProps
  } = component.props as any;

  return (
    <MantineImage
      alt={alt}
      imageProps={{ src }}
      {...componentProps}
      width={width ?? "100px"}
      height={height ?? "100px"}
      {...triggers}
      style={style}
    />
  );
};
