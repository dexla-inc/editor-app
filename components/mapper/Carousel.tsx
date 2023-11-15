import { Component } from "@/utils/editor";
import { Carousel as MantineCarousel } from "@mantine/carousel";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
};

export const Carousel = ({ renderTree, component, ...props }: Props) => {
  const { children, triggers, style, ...componentProps } = component.props!;
  const { height, width } = style;

  return (
    <MantineCarousel
      {...props}
      {...componentProps}
      {...triggers}
      {...style}
      height={height}
      width={width}
    >
      {(component?.children ?? []).map((child: Component) => {
        return (
          <MantineCarousel.Slide key={child.id} h="100%" w="100%">
            {renderTree(child)}
          </MantineCarousel.Slide>
        );
      })}
    </MantineCarousel>
  );
};
