import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { ImageProps, Image as MantineImage } from "@mantine/core";
import { forwardRef, memo, useEffect } from "react";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useBindingPopover } from "@/hooks/useBindingPopover";
import { useData } from "@/hooks/useData";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  shareableContent?: any;
} & ImageProps;

const ImageComponent = forwardRef(
  ({ component, shareableContent, ...props }: Props, ref) => {
    const { triggers, loading, ...componentProps } = component.props as any;

    const { getValue } = useData();
    const srcValue = getValue("src", { component, shareableContent });
    const altValue = getValue("alt", { component, shareableContent });

    const { getSelectedVariable, handleValuesUpdate } = useBindingPopover();
    const sourceVariable = getSelectedVariable(srcValue);
    const altTextVariable = getSelectedVariable(altValue);

    const isVariablesSame =
      sourceVariable?.defaultValue === srcValue &&
      altTextVariable?.defaultValue === altValue;

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
