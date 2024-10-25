import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { EditableComponentMapper } from "@/utils/editor";
import { ImageProps, Image as MantineImage, Box } from "@mantine/core";
import { omit } from "next/dist/shared/lib/router/utils/omit";
import { forwardRef, memo } from "react";

type Props = EditableComponentMapper & ImageProps;

const ImageComponent = forwardRef(
  (
    { component, shareableContent, grid: { ChildrenWrapper }, ...props }: Props,
    ref,
  ) => {
    const { triggers, loading, src, alt, ...componentProps } =
      component.props as any;
    const { src: srcValue = src, alt: altValue = alt } = component.onLoad;

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
      <Box unstyled style={props.style as any} {...props} {...triggers}>
        <MantineImage
          ref={ref}
          alt={String(altValue)}
          imageProps={{ src: srcValue }}
          {...componentProps}
          style={{}}
          styles={{
            root: {
              position,
              top,
              bottom,
              left,
              right,
              zIndex,
              gridArea: "1 / 1 / -1 / -1",
            },
            // @ts-ignore
            image: omit(style, ["position", "top", "bottom", "left", "right"]),
          }}
          width={width}
          height={height}
        />
        <ChildrenWrapper />
      </Box>
    );
  },
);
ImageComponent.displayName = "Image";

export const Image = memo(withComponentWrapper<Props>(ImageComponent));
