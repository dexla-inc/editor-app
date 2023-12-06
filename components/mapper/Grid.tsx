import { isSame } from "@/utils/componentComparison";
import { GRID_SIZE } from "@/utils/config";
import { Component } from "@/utils/editor";
import { Box, BoxProps, useMantineTheme } from "@mantine/core";
import { memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & BoxProps;

const GridComponent = ({ renderTree, component, ...props }: Props) => {
  const theme = useMantineTheme();
  const { style = {}, gridSize, navbarWidth } = component.props!;

  const defaultGridTemplateColumns = `repeat(${gridSize ?? GRID_SIZE}, 1fr)`;

  const gridTemplateColumns =
    navbarWidth !== undefined && component.id === "content-wrapper"
      ? `${navbarWidth} ${defaultGridTemplateColumns}`
      : defaultGridTemplateColumns;

  const gap = props?.style?.gap ? theme.spacing[props.style.gap as string] : 0;

  return (
    <Box
      display="grid"
      {...component.props}
      {...props}
      id={component.id}
      pos="relative"
      style={{
        ...props.style,
        ...style,
        gap: props?.style?.gap ? gap : theme.spacing.xs,
        gridTemplateColumns: gridTemplateColumns ?? defaultGridTemplateColumns,
      }}
    >
      {component.children &&
        component.children.length > 0 &&
        component.children?.map((child: Component) => renderTree(child))}
    </Box>
  );
};

export const Grid = memo(GridComponent, isSame);
