import { Box, Text, px, useMantineTheme } from "@mantine/core";
import { PropsWithChildren, useEffect, useState } from "react";
import { Resizable } from "re-resizable";
import { useEditorStore } from "@/stores/editor";
import {
  getComponentById,
  getComponentIndex,
  getComponentParent,
  updateTreeComponent,
} from "@/utils/editor";
import cloneDeep from "lodash.clonedeep";
import { calculateGridSizes } from "@/utils/grid";

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
  const [initialSpan, setInitialSpan] = useState(0);
  const [initialNextSiblingSpan, setInitialNextSiblingSpan] = useState(0);

  const parent = getComponentParent(editorTree.root, props.id!);
  const siblings = (parent?.children ?? []).filter(
    (c) => c.name === "GridColumn",
  );

  const compIndex = getComponentIndex(parent!, props.id);
  const nextSibling =
    compIndex < siblings.length - 1 ? siblings[compIndex + 1] : null;
  const isLast = siblings[siblings.length - 1]?.id === props.id;
  const isOnlyChild = siblings.length === 1;

  useEffect(() => {
    if (columnSpans[props.id] === undefined) {
      setColumnSpan(props.id, span);
    }
  }, [columnSpans, props.id, setColumnSpan, span]);

  const handleOffset = px(
    Object.keys(theme.spacing).includes(parent?.props!.gap)
      ? theme.spacing[parent?.props!.gap ?? "xs"]
      : parent?.props!.gap ?? theme.spacing.xs,
  );

  return (
    <>
      <Box
        component={Resizable}
        p="xs"
        display="grid"
        style={{
          gridColumn: `span ${columnSpans[props.id] ?? span}`,
          gap: theme.spacing.xs,
          ...(style ?? {}),
        }}
        pos="relative"
        {...props}
        enable={{
          top: false,
          right: isLast || isOnlyChild ? false : true,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        }}
        handleStyles={{
          right: {
            width: handleOffset * 4,
            right: (handleOffset + 20) * -1,
            zIndex: 90,
          },
        }}
        handleComponent={{
          right: <Box h={40} id={`handler-${props.id}`} />,
        }}
        onResizeStart={(e: any, direction: any, ref: any, delta: any) => {
          const rect = ref.getBoundingClientRect();
          const initialSpan = ref.style.gridColumn.split(" ")[1];
          setInitialWidth(Math.floor(rect.width));
          setIsResizing(true);
          setInitialSpan(parseInt(initialSpan, 10));

          if (nextSibling) {
            const nextSiblingEl = iframeWindow?.document.getElementById(
              nextSibling?.id!,
            );

            if (nextSiblingEl) {
              const initialNextSiblingSpan =
                nextSiblingEl.style.gridColumn.split(" ")[1];

              if (initialNextSiblingSpan) {
                setInitialNextSiblingSpan(parseInt(initialNextSiblingSpan, 10));
              }
            }
          }
        }}
        onResize={(e: DragEvent, direction: any, ref: any, delta: any) => {
          const snapIndicator = iframeWindow?.document.getElementById(
            "column-snap-indicator",
          );
          const handler = iframeWindow?.document.getElementById(
            `handler-${props.id}`,
          );
          const snapIndicatorRect = snapIndicator?.getBoundingClientRect();
          const handlerRect = handler?.getBoundingClientRect();

          const isGoingLeft = delta.width < 0;
          const rect = ref.getBoundingClientRect();
          const newSpan = Math.floor(
            (Math.floor(rect.width) * initialSpan) / initialWidth,
          );
          const spanDiff = Math.abs(newSpan - initialSpan);

          const nextSiblingEl = iframeWindow?.document.getElementById(
            nextSibling?.id!,
          );

          if (nextSiblingEl) {
            const newSiblingSpan = isGoingLeft
              ? initialNextSiblingSpan + spanDiff
              : initialNextSiblingSpan - spanDiff;

            setColumnSpan(nextSibling?.id!, newSiblingSpan);
          }

          const isHalfTheParent =
            newSpan === Math.floor(parent?.props?.gridSize / 2);
          const isAThirdOfTheParent =
            newSpan === Math.floor(parent?.props?.gridSize / 3);

          if (isHalfTheParent && handlerRect && snapIndicatorRect) {
            const txt = snapIndicator?.querySelector("#text");
            if (txt) {
              txt.textContent = "1/2";
            }

            snapIndicator!.style.top = `${
              handlerRect.top - handlerRect.height
            }px`;
            snapIndicator!.style.left = `${
              e.clientX - snapIndicatorRect.width
            }px`;
            snapIndicator!.style.display = "block";
          } else if (isAThirdOfTheParent && handlerRect && snapIndicatorRect) {
            const txt = snapIndicator?.querySelector("#text");
            if (txt) {
              txt.textContent = "1/3";
            }

            snapIndicator!.style.top = `${
              handlerRect.top - handlerRect.height
            }px`;
            snapIndicator!.style.left = `${
              e.clientX - snapIndicatorRect.width
            }px`;
            snapIndicator!.style.display = "block";
          } else {
            snapIndicator!.style.display = "none";
          }

          setColumnSpan(props.id, newSpan);
        }}
        onResizeStop={() => {
          const copy = cloneDeep(editorTree);
          updateTreeComponent(copy.root, props.id, {
            span: columnSpans[props.id] ?? 0,
            resized: true,
          });

          if (nextSibling) {
            updateTreeComponent(copy.root, nextSibling.id!, {
              span: columnSpans[nextSibling.id!] ?? 0,
              resized: false,
            });

            const nextSiblingComp = getComponentById(
              copy.root,
              nextSibling.id!,
            );
            if (nextSiblingComp) {
              calculateGridSizes(nextSiblingComp);
            }
          }

          const component = getComponentById(copy.root, props.id!);
          if (component) {
            calculateGridSizes(component);
          }

          setEditorTree(copy);
          setIsResizing(false);
        }}
      >
        {children}
      </Box>
      <Box
        id="column-snap-indicator"
        pos="absolute"
        bg="teal"
        px="xs"
        py={0}
        display="none"
        sx={{
          borderRadius: theme.radius.sm,
          zIndex: 100,
        }}
      >
        <Text id="text" color="white" size="xs">
          .
        </Text>
      </Box>
    </>
  );
};
