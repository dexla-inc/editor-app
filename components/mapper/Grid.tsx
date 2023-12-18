import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useEditorStore } from "@/stores/editor";
import { isSame } from "@/utils/componentComparison";
import { GRID_SIZE } from "@/utils/config";
import { Component } from "@/utils/editor";
import { calculateGridSizes } from "@/utils/grid";
import { Box, BoxProps, useMantineTheme } from "@mantine/core";
import { usePrevious } from "@mantine/hooks";
import cloneDeep from "lodash.clonedeep";
import { forwardRef, memo, useEffect } from "react";

export type GridProps = {
  renderTree: (component: Component) => any;
  component: Component;
} & BoxProps;

const GridComponent = forwardRef(
  ({ renderTree, component, ...props }: GridProps, ref) => {
    const theme = useMantineTheme();
    const editorTree = useEditorStore((state) => state.tree);
    const setEditorTree = useEditorStore((state) => state.setTree);
    const {
      style = {},
      gridSize,
      gridDirection,
      navbarWidth,
    } = component.props!;

    const isColumns = gridDirection === "column";
    const defaultGridTemplate = `repeat(${gridSize ?? GRID_SIZE}, 1fr)`;

    const gridTemplate =
      navbarWidth !== undefined && component.id === "content-wrapper"
        ? `${navbarWidth} ${defaultGridTemplate}`
        : defaultGridTemplate;

    const gap = props?.style?.gap
      ? theme.spacing[props.style?.gap as string]
      : 0;

    const gapValue = props?.style?.gap ? gap : theme.spacing.xs;
    const prevGapValue = usePrevious(gapValue);

    useEffect(() => {
      if (prevGapValue !== gapValue) {
        const copy = cloneDeep(editorTree);
        calculateGridSizes(copy.root);
        setEditorTree(copy);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gapValue, prevGapValue, setEditorTree]);

    return (
      <Box
        // @ts-ignore
        ref={ref}
        display="grid"
        {...component.props}
        {...props}
        id={component.id}
        pos="relative"
        style={{
          ...props.style,
          ...style,
          gap: gapValue,
          ...(isColumns
            ? { gridTemplateColumns: gridTemplate ?? defaultGridTemplate }
            : { gridTemplateRows: gridTemplate ?? defaultGridTemplate }),
        }}
      >
        {component.children &&
          component.children.length > 0 &&
          component.children?.map((child: Component) => renderTree(child))}
      </Box>
    );
  },
);
GridComponent.displayName = "Grid";

export const Grid = memo(
  withComponentWrapper<GridProps>(GridComponent),
  isSame,
);
