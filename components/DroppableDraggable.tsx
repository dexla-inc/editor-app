import { useComponentContextMenu } from "@/hooks/useComponentContextMenu";
import { useDraggable } from "@/hooks/useDraggable";
import { useDroppable } from "@/hooks/useDroppable";
import { useOnDragStart } from "@/hooks/useOnDragStart";
import { useOnDrop } from "@/hooks/useOnDrop";
import { useEditorStore } from "@/stores/editor";
import { Action, actionMapper, ActionTrigger } from "@/utils/actions";
import { structureMapper } from "@/utils/componentMapper";
import { DROP_INDICATOR_WIDTH, ICON_SIZE } from "@/utils/config";
import { addComponent, Component, getComponentParent } from "@/utils/editor";
import {
  ActionIcon,
  Box,
  BoxProps,
  Button,
  Group,
  Text,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import {
  IconArrowUp,
  IconBoxMargin,
  IconGripVertical,
  IconPlus,
} from "@tabler/icons-react";
import cloneDeep from "lodash.clonedeep";
import merge from "lodash.merge";
import { Router, useRouter } from "next/router";
import {
  cloneElement,
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
} from "react";

type Props = {
  id: string;
  component: Component;
  customComponentModal?: any;
  isSelected?: boolean;
} & BoxProps;

const nonDefaultActionTriggers = ["onMount", "onSuccess", "onError"];

export const DroppableDraggable = ({
  id,
  children,
  component,
  isSelected,
}: PropsWithChildren<Props>) => {
  const router = useRouter();
  const theme = useMantineTheme();
  const editorTree = useEditorStore((state) => state.tree);
  const setEditorTree = useEditorStore((state) => state.setTree);
  const iframeWindow = useEditorStore((state) => state.iframeWindow);
  const currentTargetId = useEditorStore((state) => state.currentTargetId);
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);
  const onMountActionsRan = useEditorStore((state) => state.onMountActionsRan);
  const addOnMountActionsRan = useEditorStore(
    (state) => state.addOnMountActionsRan,
  );
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind,
  );
  const pickingComponentToBindFrom = useEditorStore(
    (state) => state.pickingComponentToBindFrom,
  );
  const pickingComponentToBindTo = useEditorStore(
    (state) => state.pickingComponentToBindTo,
  );
  const setSelectedComponentId = useEditorStore(
    (state) => state.setSelectedComponentId,
  );
  const setTreeComponentCurrentState = useEditorStore(
    (state) => state.setTreeComponentCurrentState,
  );
  const currentTreeComponentsStates = useEditorStore(
    (state) => state.currentTreeComponentsStates,
  );
  const language = useEditorStore((state) => state.language);
  const highlightedComponentId = useEditorStore(
    (state) => state.highlightedComponentId,
  );
  const { forceDestroyContextMenu } = useComponentContextMenu();

  const actions: Action[] = component.actions ?? [];
  const onMountAction: Action | undefined = actions.find(
    (action: Action) => action.trigger === "onMount",
  );

  const onSuccessActions: Action[] = actions.filter(
    (action: Action) => action.trigger === "onSuccess",
  );

  const onErrorActions: Action[] = actions.filter(
    (action: Action) => action.trigger === "onError",
  );

  const triggers = actions.reduce(
    (acc, action: Action) => {
      if (nonDefaultActionTriggers.includes(action.trigger)) {
        return acc;
      }

      return {
        ...acc,
        [action.trigger]: (e: any) =>
          actionMapper[action.action.name].action({
            // @ts-ignore
            action: action.action,
            actionId: action.id,
            router: router as Router,
            event: e,
            onSuccess: onSuccessActions.find(
              (sa) => sa.sequentialTo === action.id,
            ),
            onError: onErrorActions.find((ea) => ea.sequentialTo === action.id),
            component,
          }),
      };
    },
    {} as Record<ActionTrigger, any>,
  );

  useEffect(() => {
    if (
      onMountAction &&
      isPreviewMode &&
      !onMountActionsRan.includes(onMountAction.id)
    ) {
      addOnMountActionsRan(onMountAction.id);
      actionMapper[onMountAction.action.name].action({
        // @ts-ignore
        action: onMountAction.action,
        actionId: onMountAction.id,
        router: router as Router,
        onSuccess: onSuccessActions.find(
          (sa) => sa.sequentialTo === onMountAction.id,
        ),
        onError: onErrorActions.find(
          (ea) => ea.sequentialTo === onMountAction.id,
        ),
        component,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPreviewMode, onMountAction, onMountActionsRan]);

  const parent = useMemo(
    () => getComponentParent(editorTree.root, id),
    [editorTree.root, id],
  );

  const onDragStart = useOnDragStart();
  const onDrop = useOnDrop();

  const draggable = useDraggable({
    id,
    onDragStart,
    currentWindow: iframeWindow,
  });
  const { edge, ...droppable } = useDroppable({
    id,
    onDrop,
    currentWindow: iframeWindow,
  });

  const isPicking = pickingComponentToBindFrom || pickingComponentToBindTo;
  const isOver = currentTargetId === id;
  const isHighlighted = highlightedComponentId === id;
  const borderColor = isPicking ? "orange" : "teal";
  const baseShadow = `0 0 0 2px ${theme.colors[borderColor][6]}`;
  const isColumn = component.name === "GridColumn";

  const shadows = isHighlighted
    ? { boxShadow: `0 0 0 2px ${theme.colors.orange[6]}` }
    : isOver
    ? {
        boxShadow:
          edge === "top"
            ? `0 -${DROP_INDICATOR_WIDTH}px 0 0 ${theme.colors.teal[6]}, ${baseShadow}`
            : edge === "bottom"
            ? `0 ${DROP_INDICATOR_WIDTH}px 0 0 ${theme.colors.teal[6]}, ${baseShadow}`
            : edge === "left"
            ? `-${DROP_INDICATOR_WIDTH}px 0 0 0 ${theme.colors.teal[6]}, ${baseShadow}`
            : edge === "right"
            ? `${DROP_INDICATOR_WIDTH}px 0 0 0 ${theme.colors.teal[6]}, ${baseShadow}`
            : baseShadow,
        background: edge === "center" ? theme.colors.teal[6] : "none",
        opacity: edge === "center" ? 0.4 : 1,
      }
    : isSelected
    ? { boxShadow: baseShadow }
    : {};

  const currentState =
    currentTreeComponentsStates?.[component.id!] ?? "default";
  const hoverStateFunc = () => {
    if (currentState === "default") {
      setTreeComponentCurrentState(component.id!, "hover");
    }
  };
  const leaveHoverStateFunc = () => {
    if (currentState === "hover") {
      setTreeComponentCurrentState(component.id!, "default");
    }
  };

  const propsWithOverwrites = merge(
    {},
    component.props,
    component.languages?.[language],
    component.states?.[currentState],
  );

  const isWidthPercentage = propsWithOverwrites?.style?.width?.endsWith("%");
  const isHeightPercentage = propsWithOverwrites?.style?.height?.endsWith("%");
  merge(propsWithOverwrites, {
    style: {
      // setting the inner div width/height. If percentage, the inner div size is 100% and the actual size is propagated
      // up to the parent element (the green border div)
      width: isWidthPercentage ? "100%" : propsWithOverwrites?.style?.width,
      height: isHeightPercentage ? "100%" : propsWithOverwrites?.style?.height,
      position: "relative",
    },
    disabled:
      component.props?.disabled ??
      (currentState === "disabled" && !!component.states?.disabled),
    triggers: isPreviewMode
      ? {
          ...triggers,
          onMouseEnter: triggers?.onHover ?? hoverStateFunc,
          onMouseLeave: leaveHoverStateFunc,
        }
      : {},
  });

  const setDefaultComponentWidth = useEditorStore(
    (state) => state.setDefaultComponentWidth,
  );

  const ref = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    if (ref.current && isSelected) {
      const width = ref.current?.children[1]?.getBoundingClientRect().width;
      setDefaultComponentWidth(width);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSelected, id]);

  const ColumnSchema = structureMapper["GridColumn"].structure({});
  const GridSchema = structureMapper["Grid"].structure({});

  const ChildWithHelpers = () => {
    return (
      <>
        {/* @ts-ignore */}
        {children?.children}
        {isSelected && !isPreviewMode && (
          <Group
            h={20}
            top={-20}
            left={0}
            noWrap
            pos="absolute"
            spacing="xs"
            style={{ zIndex: 999 }}
          >
            <Box
              h={20}
              bg="green"
              {...(isColumn ? {} : draggable)}
              px={10}
              sx={{
                cursor: isColumn ? "default" : "move",
              }}
            >
              <Text size="xs" color="white">
                {component.description}
              </Text>
            </Box>
            {component.name === "Grid" && (
              <>
                <Button
                  color="green"
                  size="xs"
                  compact
                  onClick={() => {
                    const copy = cloneDeep(editorTree);
                    addComponent(copy.root, ColumnSchema, {
                      id: component.id!,
                      edge: "center",
                    });

                    setEditorTree(copy);
                  }}
                >
                  Add Column
                </Button>
                <Button
                  color="green"
                  size="xs"
                  compact
                  onClick={() => {
                    const copy = cloneDeep(editorTree);
                    addComponent(
                      copy.root,
                      // @ts-ignore
                      { ...GridSchema, children: [ColumnSchema] },
                      {
                        id: parent?.id!,
                        edge: "center",
                      },
                    );

                    setEditorTree(copy);
                  }}
                >
                  Add Row
                </Button>
              </>
            )}
            {component.name === "GridColumn" && (
              <>
                <Button
                  color="green"
                  size="xs"
                  compact
                  onClick={() => {
                    const copy = cloneDeep(editorTree);
                    addComponent(copy.root, GridSchema, {
                      id: component.id!,
                      edge: "center",
                    });

                    setEditorTree(copy);
                  }}
                >
                  Split Column
                </Button>
                <Button
                  color="green"
                  size="xs"
                  compact
                  onClick={() => {
                    const copy = cloneDeep(editorTree);
                    addComponent(
                      copy.root,
                      // @ts-ignore
                      { ...GridSchema, children: [ColumnSchema] },
                      {
                        id: component?.id!,
                        edge: "center",
                      },
                    );

                    setEditorTree(copy);
                  }}
                >
                  Add Row
                </Button>
              </>
            )}
          </Group>
        )}
      </>
    );
  };

  const childWithHelpers = ChildWithHelpers();

  return (
    <>
      {cloneElement(
        // @ts-ignore
        children,
        {
          component,
          ...droppable,
          ...propsWithOverwrites,
          pos: "relative",
          isPreviewMode,
          style: {
            ...propsWithOverwrites.style,
            ...(component.props?.style ?? {}),
            ...shadows,
          },
          onClick: (e: any) => {
            if (!isPreviewMode) {
              e.stopPropagation();
              // @ts-ignore
              propsWithOverwrites.onClick?.(e);
              forceDestroyContextMenu();

              if (isPicking) {
                setComponentToBind(id);
              } else {
                setSelectedComponentId(id);
              }
            }
          },
        },
        childWithHelpers,
      )}
    </>
  );
};
