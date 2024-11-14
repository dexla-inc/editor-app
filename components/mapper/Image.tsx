import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { EditableComponentMapper } from "@/utils/editor";
import { ImageProps, Image as MantineImage, Box } from "@mantine/core";
import { omit } from "next/dist/shared/lib/router/utils/omit";
import { forwardRef, memo } from "react";

type Props = EditableComponentMapper & ImageProps;

const ImageComponent = forwardRef(
  (
    {
      renderTree,
      component,
      shareableContent,
      grid: { ChildrenWrapper, isGridCss },
      ...props
    }: Props,
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
      <Box unstyled {...props} {...triggers} data-id={props.id}>
        <MantineImage
          ref={ref}
          alt={String(altValue)}
          imageProps={{ src: srcValue, ["data-id"]: props.id }}
          {...componentProps}
          style={{}}
          styles={{
            root: {
              gridArea: "1 / 1 / -1 / -1",
            },
            image: {
              ...omit(style, ["position", "top", "bottom", "left", "right"]),
              height: "100%",
            },
          }}
          {...(isGridCss && {
            height: "100%",
          })}
          fit="fill"
        />
        <ChildrenWrapper />
      </Box>
    );
  },
);
ImageComponent.displayName = "Image";

export const Image = memo(withComponentWrapper<Props>(ImageComponent));
