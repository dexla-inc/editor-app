import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";
import {
  EditorTreeCopy,
  getComponentIndex,
  getComponentParent,
} from "@/utils/editor";
import { calculateGridSizes } from "@/utils/grid";
import { Box, Text, px, useMantineTheme } from "@mantine/core";
import { Resizable } from "re-resizable";
import { PropsWithChildren, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";

export const GridColumn = ({
  children,
  style: gridColumnStyles,
  span,
  ...props
}: PropsWithChildren<any>) => {
  const { flexWrap, ...style } = gridColumnStyles;
  const theme = useMantineTheme();
  const columnSpans = useEditorTreeStore((state) => state.columnSpans ?? {});
  const setColumnSpan = useEditorTreeStore((state) => state.setColumnSpan);
  const iframeWindow = useEditorStore((state) => state.iframeWindow);
  const isResizing = useEditorStore((state) => state.isResizing);
  const setIsResizing = useEditorStore((state) => state.setIsResizing);
  const [initialWidth, setInitialWidth] = useState(0);
  const [initialSpan, setInitialSpan] = useState(0);
  const [initialNextSiblingSpan, setInitialNextSiblingSpan] = useState(0);
  const isPreviewMode = useEditorTreeStore(
    useShallow((state) => state.isPreviewMode || state.isLive),
  );

  const parent = useMemo(() => {
    const editorTree = useEditorTreeStore.getState().tree as EditorTreeCopy;
    return getComponentParent(editorTree.root, props.id!);
  }, [props.id]);
  const siblings = (parent?.children ?? []).filter(
    (c) => c.name === "GridColumn",
  );

  const compIndex = getComponentIndex(parent!, props.id);
  const nextSibling =
    compIndex < siblings.length - 1 ? siblings[compIndex + 1] : null;
  const isLast = siblings[siblings.length - 1]?.id === props.id;
  const isOnlyChild = siblings.length === 1;
  const isDirectionHorizontal = style?.gridAutoFlow === "column";

  const handleOffset = px(
    Object.keys(theme.spacing).includes(parent?.props?.gap)
      ? theme.spacing[parent?.props?.gap ?? "xs"]
      : parent?.props?.gap ?? theme.spacing.xs,
  );

  const isParentGridDirectionColumn = parent?.props?.gridDirection === "column";
  console.log("isPreviewModeGridColumn", isPreviewMode);

  return (
    <>
      <Box
        {...(!isPreviewMode ? { component: Resizable } : {})}
        p="xs"
        size={{ height: style?.height }}
        style={{
          display: isDirectionHorizontal ? "flex" : "grid",
          ...(isDirectionHorizontal ? { flexWrap: flexWrap ?? "wrap" } : {}),
          gridColumn: `span ${isResizing ? columnSpans[props.id] : span}`,
          gridRow: !isParentGridDirectionColumn
            ? `span ${isResizing ? columnSpans[props.id] : span}`
            : undefined,
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
        {...(!isPreviewMode
          ? {
              handleStyles: {
                right: {
                  width: handleOffset * 4,
                  right: (handleOffset + 20) * -1,
                  zIndex: 90,
                },
              },
            }
          : {})}
        {...(!isPreviewMode
          ? {
              handleComponent: {
                right: <Box h={40} id={`handler-${props.id}`} />,
              },
            }
          : {})}
        {...(!isPreviewMode
          ? {
              onResizeStart: (e: any, direction: any, ref: any, delta: any) => {
                const rect = ref.getBoundingClientRect();
                const initialSpan = ref.style?.gridColumn.split(" ")[1];
                setIsResizing(true);
                setInitialWidth(Math.floor(rect.width));
                setInitialSpan(parseInt(initialSpan, 10));

                if (nextSibling) {
                  const nextSiblingEl = iframeWindow?.document.getElementById(
                    nextSibling?.id!,
                  );

                  if (nextSiblingEl) {
                    const initialNextSiblingSpan =
                      nextSiblingEl.style?.gridColumn.split(" ")[1];

                    if (initialNextSiblingSpan) {
                      setInitialNextSiblingSpan(
                        parseInt(initialNextSiblingSpan, 10),
                      );
                    }
                  }
                }
              },
            }
          : {})}
        {...(!isPreviewMode
          ? {
              onResize: (
                e: DragEvent,
                direction: any,
                ref: any,
                delta: any,
              ) => {
                const snapIndicator = iframeWindow?.document.getElementById(
                  "column-snap-indicator",
                );
                const handler = iframeWindow?.document.getElementById(
                  `handler-${props.id}`,
                );
                const snapIndicatorRect =
                  snapIndicator?.getBoundingClientRect();
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
                } else if (
                  isAThirdOfTheParent &&
                  handlerRect &&
                  snapIndicatorRect
                ) {
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
              },
            }
          : {})}
        {...(!isPreviewMode
          ? {
              onResizeStop: async () => {
                const updateTreeComponentAttrs =
                  useEditorTreeStore.getState().updateTreeComponentAttrs;

                updateTreeComponentAttrs({
                  componentIds: [props.id],
                  attrs: {
                    props: {
                      span: columnSpans[props.id] ?? 0,
                      resized: false,
                    },
                  },
                });

                if (nextSibling) {
                  updateTreeComponentAttrs({
                    componentIds: [nextSibling.id!],
                    attrs: {
                      props: {
                        span: columnSpans[nextSibling.id!] ?? 0,
                        resized: false,
                      },
                    },
                  });

                  const nextSiblingComp =
                    useEditorTreeStore.getState().componentMutableAttrs[
                      nextSibling.id!
                    ];
                  if (nextSiblingComp) {
                    calculateGridSizes(nextSiblingComp);
                  }
                }

                const component =
                  useEditorTreeStore.getState().componentMutableAttrs[
                    props.id!
                  ];
                if (component) {
                  calculateGridSizes(component);
                }

                setIsResizing(false);
              },
            }
          : {})}
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
