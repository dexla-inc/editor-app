import { useEditorStore } from "@/stores/editor";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { ImageProps, Image as MantineImage } from "@mantine/core";
import get from "lodash.get";
import { forwardRef, memo } from "react";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & ImageProps;

const ImageComponent = forwardRef(({ component, ...props }: Props, ref) => {
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);

  const {
    alt = "Image",
    src,
    triggers,
    data,
    repeatedIndex,
    dataPath,
    loading,
    ...componentProps
  } = component.props as any;

  const { width, height, ...style } = props.style ?? {};

  let value = isPreviewMode ? data?.value ?? src : src;

  if (isPreviewMode && typeof repeatedIndex !== "undefined" && dataPath) {
    const path = dataPath.replaceAll("[0]", `[${repeatedIndex}]`);
    value = get(data?.base ?? {}, path) ?? src;
  }

  console.log(props.style);

  return (
    <MantineImage
      ref={ref}
      id={component.id}
      alt={alt}
      imageProps={{ src: value }}
      {...props}
      {...componentProps}
      style={{}}
      styles={{ root: { position: "relative" }, image: style }}
      width={width}
      height={height}
      {...triggers}
    />
  );
});
ImageComponent.displayName = "Image";

export const Image = memo(withComponentWrapper<Props>(ImageComponent), isSame);
