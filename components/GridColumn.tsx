import { Box, useMantineTheme } from "@mantine/core";
import { PropsWithChildren, useEffect, useState } from "react";
import { Resizable } from "re-resizable";
import { useEditorStore } from "@/stores/editor";
import {
  getComponentIndex,
  getComponentParent,
  updateTreeComponent,
} from "@/utils/editor";
import cloneDeep from "lodash.clonedeep";

export const GridColumn = ({
  children,
  style,
  span,
  ...props
}: PropsWithChildren<any>) => {
  const theme = useMantineTheme();
  const editorTree = useEditorStore((state) => state.tree);
  const setEditorTree = useEditorStore((state) => state.setTree);
  const columnSpans = useEditorStore((state) => state.columnSpans ?? {});
  const setColumnSpan = useEditorStore((state) => state.setColumnSpan);
  const iframeWindow = useEditorStore((state) => state.iframeWindow);
  const setIsResizing = useEditorStore((state) => state.setIsResizing);
  const [initialWidth, setInitialWidth] = useState(0);
  const [initialNextSiblingSpan, setInitialNextSiblingSpan] = useState(0);
  const [initialPrevSiblingSpan, setInitialPrevSiblingSpan] = useState(0);

  const parent = getComponentParent(editorTree.root, props.id!);
  const siblings = (parent?.children ?? []).filter(
    (c) => c.name === "GridColumn",
  );

  const compIndex = getComponentIndex(parent!, props.id);
  const nextSibling =
    compIndex < siblings.length - 1 ? siblings[compIndex + 1] : null;
  const prevSibling = compIndex > 0 ? siblings[compIndex - 1] : null;
  const isLast = siblings[siblings.length - 1]?.id === props.id;
  const isOnlyChild = siblings.length === 1;
  const resizingFromLeft = isLast && !isOnlyChild;

  /* useEffect(() => {
    if (iframeWindow?.document) {
      const comp = iframeWindow.document.getElementById(props.id);
      if (comp) {
        const rect = comp.getBoundingClientRect();
        console.log({ comp, rect });
        setInitialWidth(rect.width);
      }
    }
  }, [iframeWindow, props.id]); */

  useEffect(() => {
    if (columnSpans[props.id] === undefined) {
      setColumnSpan(props.id, span);
    }
  }, [columnSpans, props.id, setColumnSpan, span]);

  return (
    <Box
      component={Resizable}
      p="xs"
      display="grid"
      style={{
        gridColumn: `span ${columnSpans[props.id] ?? 0}`,
        gap: theme.spacing.xs,
        ...(style ?? {}),
      }}
      pos="relative"
      {...props}
      enable={{
        top: false,
        right: isLast || isOnlyChild ? false : true,
        bottom: false,
        left: resizingFromLeft,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      }}
      onResizeStart={(e: any, direction: any, ref: any, delta: any) => {
        const rect = ref.getBoundingClientRect();
        setInitialWidth(rect.width);
        setIsResizing(true);

        if (nextSibling) {
          setInitialNextSiblingSpan(nextSibling.props?.span);
        }

        if (prevSibling) {
          setInitialPrevSiblingSpan(prevSibling.props?.span);
        }
      }}
      onResize={(e: any, direction: any, ref: any, delta: any) => {
        const isRightResizer = direction === "right";
        const isGoingLeft = delta.width < 0;
        const rect = ref.getBoundingClientRect();
        const newSpan = Math.floor((rect.width * span) / initialWidth);
        console.log({ newSpan, ref, initialWidth, span, w: rect.width });

        const spanDiff = Math.abs(newSpan - span);

        if (isRightResizer) {
          const nextSiblingEl = iframeWindow?.document.getElementById(
            nextSibling?.id!,
          );

          if (nextSiblingEl) {
            const newSiblingSpan = isGoingLeft
              ? initialNextSiblingSpan + spanDiff
              : initialNextSiblingSpan - spanDiff;

            setColumnSpan(nextSibling?.id!, newSiblingSpan);
          }
        } /* else {
          const prevSiblingEl = iframeWindow?.document.getElementById(
            prevSibling?.props?.id,
          );

          if (prevSiblingEl) {
            const newSiblingSpan = isGoingLeft
              ? initialPrevSiblingSpan - spanDiff
              : initialPrevSiblingSpan + spanDiff;

            setColumnSpan(prevSibling?.props?.id, newSiblingSpan);
          }
        } */

        setColumnSpan(props.id, newSpan);
      }}
      onResizeStop={() => {
        const copy = cloneDeep(editorTree);
        updateTreeComponent(copy.root, props.id, {
          span: columnSpans[props.id] ?? 0,
          resized: true,
        });

        if (nextSibling) {
          console.log({ nextSibling });
          updateTreeComponent(copy.root, nextSibling.id!, {
            span: columnSpans[nextSibling.id!] ?? 0,
            resized: false,
          });
        }

        /* if (nextSibling && !resizingFromLeft) {
          updateTreeComponent(copy.root, nextSibling?.props?.id, {
            span: columnSpans[nextSibling?.props?.id] ?? 0,
            resized: false,
          });
        } else if (prevSibling && resizingFromLeft) {
          updateTreeComponent(copy.root, prevSibling?.props?.id, {
            span: columnSpans[prevSibling?.props?.id] ?? 0,
            resized: false,
          });
        } */
        setEditorTree(copy);
        setIsResizing(false);
      }}
    >
      {children}
    </Box>
  );
};
