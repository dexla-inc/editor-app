import { Component } from "@/utils/editor";
import { Carousel as MantineCarousel } from "@mantine/carousel";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
};

export const Carousel = ({ renderTree, component, ...props }: Props) => {
  const { children, triggers, ...componentProps } = component.props!;

  return (
    <MantineCarousel {...props} {...componentProps} {...triggers}>
      {(component?.children ?? []).map((child: Component) => {
        return (
          <MantineCarousel.Slide key={child.id}>
            {renderTree(child)}
          </MantineCarousel.Slide>
        );
      })}
    </MantineCarousel>
  );
};
