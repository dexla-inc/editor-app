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

const ImageComponent = forwardRef(
  ({ component, shareableContent, ...props }: Props, ref) => {
    const {
      alt = "Image",
      src,
      triggers,
      dataType,
      loading,
      ...componentProps
    } = component.props as any;

    const { srcKey, altKey } = component.onLoad ?? {};

    const srcValue =
      dataType === "dynamic" ? shareableContent.data?.[srcKey] : src;
    const altValue =
      dataType === "dynamic" ? shareableContent.data?.[altKey] : alt;

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
        alt={altValue}
        imageProps={{ src: srcValue }}
        {...props}
        {...componentProps}
        style={{}}
        styles={{ root: { position: "relative" }, image: style }}
        width={width}
        height={height}
        {...triggers}
      />
    );
  },
);
ImageComponent.displayName = "Image";

export const Image = memo(withComponentWrapper<Props>(ImageComponent), isSame);
