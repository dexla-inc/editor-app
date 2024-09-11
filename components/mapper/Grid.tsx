import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useEditorTreeStore } from "@/stores/editorTree";
import { GRID_SIZE } from "@/utils/config";
import { convertSizeToPx } from "@/utils/defaultSizes";
import { EditableComponentMapper, checkNavbarExists } from "@/utils/editor";
import { calculateGridSizes } from "@/utils/grid";
import { Box, BoxProps, MantineSize, useMantineTheme } from "@mantine/core";
import { usePrevious } from "@mantine/hooks";
import { forwardRef, memo, useEffect } from "react";

export type GridProps = EditableComponentMapper & BoxProps;

const GridComponent = forwardRef(
  ({ renderTree, component, shareableContent, ...props }: GridProps, ref) => {
    const theme = useMantineTheme();
    const setEditorTree = useEditorTreeStore((state) => state.setTree);
    const {
      gridSize,
      gridDirection,
      navbarWidth,
      gap,
      triggers,
      ...componentProps
    } = component.props!;

    const isColumns = gridDirection === "column";
    const defaultGridTemplate = `repeat(${gridSize ?? GRID_SIZE}, 1fr)`;

    let gridTemplate = defaultGridTemplate;
    if (navbarWidth !== undefined && component.id === "content-wrapper") {
      const navbarExists = checkNavbarExists();

      if (navbarExists) gridTemplate = `${navbarWidth} ${defaultGridTemplate}`;
    }

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
        onClick={triggers?.onClick}
        {...props}
        pos="relative"
        style={{
          ...props.style,
          gap: gapValue,
          ...(isColumns
            ? { gridTemplateColumns: gridTemplate ?? defaultGridTemplate }
            : { gridTemplateRows: gridTemplate ?? defaultGridTemplate }),
        }}
      >
        {component.children &&
          component.children.length > 0 &&
          component.children?.map((child) =>
            renderTree(child, shareableContent),
          )}
      </Box>
    );
  },
);
GridComponent.displayName = "Grid";

export const Grid = memo(withComponentWrapper<GridProps>(GridComponent));
