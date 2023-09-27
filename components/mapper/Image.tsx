import { useEditorStore } from "@/stores/editor";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { ImageProps, Image as MantineImage } from "@mantine/core";
import get from "lodash.get";
import { memo } from "react";
import { MantineSkeleton } from "./skeleton/Skeleton";

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

  // check if data is being fetched
  const isLoading = loading ?? false;

  if (isLoading)
    <MantineSkeleton
      height={height ?? "100px"}
      width={height ?? "100px"}
      radius={10}
    />;

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
