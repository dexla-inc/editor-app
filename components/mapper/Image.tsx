import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { isSame } from "@/utils/componentComparison";
import { EditableComponentMapper } from "@/utils/editor";
import { ImageProps, Image as MantineImage } from "@mantine/core";
import { omit } from "next/dist/shared/lib/router/utils/omit";
import { forwardRef, memo } from "react";
import { useComputeValue } from "@/hooks/useComputeValue";

type Props = EditableComponentMapper & ImageProps;

const ImageComponent = forwardRef(
  ({ component, shareableContent, ...props }: Props, ref) => {
    const { triggers, loading, ...componentProps } = component.props as any;

    const srcValue = useComputeValue({
      componentId: component.id!,
      field: "src",
      shareableContent,
      staticFallback: component.props?.src,
    });
    const altValue = useComputeValue({
      componentId: component.id!,
      field: "alt",
      shareableContent,
      staticFallback: component.props?.alt,
    });

    const {
      width,
      height,
      position,
      top,
      bottom,
      left,
      right,
      zIndex,
      ...style
    } = props.style ?? {};

    return (
      <MantineImage
        ref={ref}
        alt={altValue}
        imageProps={{ src: srcValue }}
        {...props}
        {...componentProps}
        style={{}}
        styles={{
          root: { position, top, bottom, left, right, zIndex },
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
