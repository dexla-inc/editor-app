import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { ImageProps, Image as MantineImage } from "@mantine/core";
import { forwardRef, memo, useEffect } from "react";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useBindingPopover } from "@/hooks/useBindingPopover";
import { useEditorStore } from "@/stores/editor";
import get from "lodash.get";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  shareableContent?: any;
} & ImageProps;

const ImageComponent = forwardRef(({ component, ...props }: Props, ref) => {
  const {
    alt = "Image",
    src,
    triggers,
    dataType,
    loading,
    ...componentProps
  } = component.props as any;

  const { dataValueKey } = component.onLoad ?? {};

  const value =
    dataType === "dynamic" ? props.shareableContent.data?.[dataValueKey] : src;

  const { getSelectedVariable, handleValuesUpdate } = useBindingPopover();
  const sourceVariable = getSelectedVariable(srcKey);
  const altTextVariable = getSelectedVariable(altKey);

  const isVariablesSame =
      sourceVariable?.defaultValue === src &&
      altTextVariable?.defaultValue === alt;

  useEffect(() => {
    if (isVariablesSame) return;
    handleValuesUpdate(component.id as string, {
      src: sourceVariable?.defaultValue,
      alt: altTextVariable?.defaultValue,
    });
  }, [sourceVariable, altTextVariable]);

  const { width, height, ...style } = props.style ?? {};

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
