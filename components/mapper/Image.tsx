import { Component } from "@/utils/editor";
import { ImageProps } from "@mantine/core";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & ImageProps;

export const Image = ({ renderTree, component, ...props }: Props) => {
  const { style = {}, ...componentProps } = component.props as any;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={style?.alt || "Image"}
      {...props}
      {...componentProps}
      width={style?.width ?? "100px"}
      height={style?.height ?? "100px"}
      style={style}
    />
  );
};
