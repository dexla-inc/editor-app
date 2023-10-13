import { useEditorStore } from "@/stores/editor";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { ImageProps, Image as MantineImage } from "@mantine/core";
import get from "lodash.get";
import { memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & ImageProps;

const ImageComponent = ({ component }: Props) => {
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);

  const {
    alt = "Image",
    src,
    style: { width, height, ...style },
    triggers,
    data,
    repeatedIndex,
    dataPath,
    loading,
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
      imageProps={{ src: value, style }}
      {...componentProps}
      width={width ?? "100px"}
      height={height ?? "100px"}
      {...triggers}
    />
  );
};

export const Image = memo(ImageComponent, isSame);
