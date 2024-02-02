import { useDataContext } from "@/contexts/DataProvider";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { ImageProps, Image as MantineImage } from "@mantine/core";
import { omit } from "next/dist/shared/lib/router/utils/omit";
import { forwardRef, memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  shareableContent?: any;
} & ImageProps;

const ImageComponent = forwardRef(
  ({ component, shareableContent, ...props }: Props, ref) => {
    const { triggers, loading, ...componentProps } = component.props as any;

    const { computeValue } = useDataContext()!;
    const srcValue =
      computeValue({
        value: component.onLoad?.src,
        shareableContent,
      }) ?? component.props?.src;
    const altValue =
      computeValue({
        value: component.onLoad?.alt,
        shareableContent,
      }) ?? component.props?.alt;

    const { width, height, position, top, bottom, left, right, ...style } =
      props.style ?? {};

    return (
      <MantineImage
        ref={ref}
        id={component.id}
        alt={altValue}
        imageProps={{ src: srcValue }}
        {...props}
        {...componentProps}
        style={{}}
        styles={{
          root: { position, top, bottom, left, right },
          // @ts-ignore
          image: omit(style, ["position", "top", "bottom", "left", "right"]),
        }}
        width={width}
        height={height}
        {...triggers}
      />
    );
  },
);
ImageComponent.displayName = "Image";

export const Image = memo(withComponentWrapper<Props>(ImageComponent), isSame);
