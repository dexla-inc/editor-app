import { useEditorStore } from "@/stores/editor";
import { Component } from "@/utils/editor";
import { ImageProps, Image as MantineImage } from "@mantine/core";
import get from "lodash.get";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & ImageProps;

export const Image = ({ component }: Props) => {
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);

  const {
    alt = "Image",
    src,
    style: { width, height, ...style },
    triggers,
    data,
    repeatedIndex,
    dataPath,
    ...componentProps
  } = component.props as any;

  let value = isPreviewMode ? data?.value ?? src : src;

  if (isPreviewMode && typeof repeatedIndex !== "undefined" && dataPath) {
    const path = dataPath.replaceAll("[0]", `[${repeatedIndex}]`);
    value = get(data?.base ?? {}, path) ?? src;
  }

  return (
    <MantineImage
      alt={alt}
      imageProps={{ src: value }}
      {...componentProps}
      width={width ?? "100px"}
      height={height ?? "100px"}
      {...triggers}
      style={style}
    />
  );
};
