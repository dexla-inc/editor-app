import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useEditorStore } from "@/stores/editor";
import { isSame } from "@/utils/componentComparison";
import { GRID_SIZE } from "@/utils/config";
import { convertSizeToPx } from "@/utils/defaultSizes";
import { EditableComponentMapper } from "@/utils/editor";
import { calculateGridSizes } from "@/utils/grid";
import { Box, BoxProps, MantineSize, useMantineTheme } from "@mantine/core";
import { usePrevious } from "@mantine/hooks";
import { forwardRef, memo, useEffect } from "react";

export type GridProps = EditableComponentMapper & BoxProps;

const GridComponent = forwardRef(
  ({ renderTree, component, ...props }: GridProps, ref) => {
    const theme = useMantineTheme();
    const setEditorTree = useEditorStore((state) => state.setTree);
    const {
      style = {},
      gridSize,
      gridDirection,
      navbarWidth,
      gap,
      ...componentProps
    } = component.props!;

    const isColumns = gridDirection === "column";
    const defaultGridTemplate = `repeat(${gridSize ?? GRID_SIZE}, 1fr)`;

    const gridTemplate =
      navbarWidth !== undefined && component.id === "content-wrapper"
        ? `${navbarWidth} ${defaultGridTemplate}`
        : defaultGridTemplate;

    const gapValue = convertSizeToPx(
      gap ?? (theme.spacing.xs as MantineSize),
      "gap",
    );
    const prevGapValue = usePrevious(gapValue);

    useEffect(() => {
      if (prevGapValue !== gapValue) {
        calculateGridSizes();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gapValue, prevGapValue, setEditorTree]);

    return (
      <Box
        // @ts-ignore
        ref={ref}
        display="grid"
        {...componentProps}
        {...props}
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
          component.children?.map((child) => renderTree(child))}
      </Box>
    );
  },
);
GridComponent.displayName = "Grid";

export const Grid = memo(
  withComponentWrapper<GridProps>(GridComponent),
  isSame,
);
