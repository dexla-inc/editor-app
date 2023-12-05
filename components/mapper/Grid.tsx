import { isSame } from "@/utils/componentComparison";
import { useUserConfigStore } from "@/stores/userConfig";
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
  const { style = {}, gridSize } = component.props!;
  const navbarWidth = useUserConfigStore((state) => state.navbarWidth);

  const repeatTemplateColumns = `repeat(${gridSize ?? GRID_SIZE}, 1fr)`;
  const gridTemplateColumns =
    navbarWidth !== undefined && component.id === "content-wrapper"
      ? `${navbarWidth} ${repeatTemplateColumns}`
      : repeatTemplateColumns;

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
        gap: Object.keys(theme.spacing).includes(component.props!.gap)
          ? theme.spacing[component.props!.gap ?? "xs"]
          : component.props!.gap ?? theme.spacing.xs,
        gridTemplateColumns: gridTemplateColumns,
      }}
    >
      {component.children &&
        component.children.length > 0 &&
        component.children?.map((child: Component) => renderTree(child))}
    </Box>
  );
};

export const Grid = memo(GridComponent, isSame);
