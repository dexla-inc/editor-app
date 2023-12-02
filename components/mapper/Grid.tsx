import { GRID_SIZE } from "@/utils/config";
import { Component } from "@/utils/editor";
import { Box, BoxProps, useMantineTheme } from "@mantine/core";
import merge from "lodash.merge";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & BoxProps;

export const Grid = ({ renderTree, component, ...props }: Props) => {
  const theme = useMantineTheme();
  const { style = {}, gridSize, gap } = component.props!;

  return (
    <Box
      display="grid"
      {...component.props}
      {...props}
      id={component.id}
      pos="relative"
      style={merge(props.style, style, {
        gap: Object.keys(theme.spacing).includes(gap)
          ? theme.spacing[gap ?? "xs"]
          : gap ?? theme.spacing.xs,
        gridTemplateColumns: `repeat(${gridSize ?? GRID_SIZE}, 1fr)`,
      })}
    >
      {component.children &&
        component.children.length > 0 &&
        component.children?.map((child: Component) => renderTree(child))}
    </Box>
  );
};
