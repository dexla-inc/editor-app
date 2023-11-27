import { useComponentContextMenu } from "@/hooks/useComponentContextMenu";
import { useDraggable } from "@/hooks/useDraggable";
import { useDroppable } from "@/hooks/useDroppable";
import { useOnDragStart } from "@/hooks/useOnDragStart";
import { useOnDrop } from "@/hooks/useOnDrop";
import { useEditorStore } from "@/stores/editor";
import { Action, actionMapper, ActionTrigger } from "@/utils/actions";
import { structureMapper } from "@/utils/componentMapper";
import { DROP_INDICATOR_WIDTH, ICON_SIZE } from "@/utils/config";
import {
  addComponent,
  Component,
  getComponentIndex,
  getComponentParent,
  removeComponentFromParent,
} from "@/utils/editor";
import {
  ActionIcon,
  BoxProps,
  Group,
  Text,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import {
  IconArrowUp,
  IconBoxMargin,
  IconColumnInsertRight,
  IconGripVertical,
  IconLayoutColumns,
  IconRowInsertBottom,
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
  const editorTheme = useEditorStore((state) => state.theme);
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

  const haveNonRootParent = parent && parent.id !== "root";

  const ChildWithHelpers = () => {
    return (
      <>
        {/* @ts-ignore */}
        {children?.children}
        {isSelected && !isPreviewMode && (
          <Group
            px={4}
            h={24}
            noWrap
            spacing={2}
            top={-24}
            left={0}
            pos="absolute"
            style={{ zIndex: 999 }}
            bg={theme.colors.teal[6]}
          >
            {!component.fixedPosition && (
              <UnstyledButton
                sx={{
                  cursor: isColumn ? "default" : "move",
                  alignItems: "center",
                  display: "flex",
                }}
                {...(isColumn ? {} : draggable)}
              >
                {component.name !== "GridColumn" && (
                  <IconGripVertical
                    size={ICON_SIZE}
                    color="white"
                    strokeWidth={1.5}
                  />
                )}
              </UnstyledButton>
            )}
            <Text color="white" size="xs" pr={haveNonRootParent ? 8 : "xs"}>
              {(component.description || "").length > 20
                ? `${component.description?.substring(0, 20)}...`
                : component.description}
            </Text>
            {haveNonRootParent && (
              <ActionIcon
                size="xs"
                variant="transparent"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedComponentId(parent.id as string);
                }}
              >
                <IconArrowUp size={ICON_SIZE} color="white" strokeWidth={1.5} />
              </ActionIcon>
            )}
            <ActionIcon
              size="xs"
              variant="transparent"
              onClick={() => {
                const container = structureMapper["Container"].structure({
                  theme: editorTheme,
                });

                if (container.props && container.props.style) {
                  container.props.style = {
                    ...container.props.style,
                    width: "auto",
                    padding: "0px",
                  };
                }

                const copy = cloneDeep(editorTree);
                const containerId = addComponent(
                  copy.root,
                  container,
                  {
                    id: parent?.id!,
                    edge: "left",
                  },
                  getComponentIndex(parent!, id),
                );

                addComponent(copy.root, component, {
                  id: containerId,
                  edge: "left",
                });

                removeComponentFromParent(copy.root, id, parent?.id!);
                setEditorTree(copy, {
                  action: `Wrapped ${component.name} with a Container`,
                });
              }}
            >
              <IconBoxMargin size={ICON_SIZE} color="white" strokeWidth={1.5} />
            </ActionIcon>
            {component.name === "Grid" && (
              <>
                <ActionIcon
                  variant="transparent"
                  size="xs"
                  onClick={() => {
                    const copy = cloneDeep(editorTree);
                    addComponent(copy.root, ColumnSchema, {
                      id: component.id!,
                      edge: "center",
                    });

                    setEditorTree(copy);
                  }}
                >
                  <IconColumnInsertRight
                    size={ICON_SIZE}
                    color="white"
                    strokeWidth={1.5}
                  />
                </ActionIcon>
                <ActionIcon
                  variant="transparent"
                  size="xs"
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
                  <IconRowInsertBottom
                    size={ICON_SIZE}
                    color="white"
                    strokeWidth={1.5}
                  />
                </ActionIcon>
              </>
            )}
            {component.name === "GridColumn" && (
              <>
                <ActionIcon
                  variant="transparent"
                  size="xs"
                  onClick={() => {
                    const copy = cloneDeep(editorTree);
                    addComponent(copy.root, GridSchema, {
                      id: component.id!,
                      edge: "center",
                    });

                    setEditorTree(copy);
                  }}
                >
                  <IconLayoutColumns
                    size={ICON_SIZE}
                    color="white"
                    strokeWidth={1.5}
                  />
                </ActionIcon>
                <ActionIcon
                  variant="transparent"
                  size="xs"
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
                  <IconRowInsertBottom
                    size={ICON_SIZE}
                    color="white"
                    strokeWidth={1.5}
                  />
                </ActionIcon>
              </>
            )}
          </Group>
        )}
      </>
    );
  };

  const childWithHelpers = ChildWithHelpers();

  const childStyles = {
    ...propsWithOverwrites.style,
    ...shadows,
  };

  delete propsWithOverwrites.style;

  return (
    <>
      {cloneElement(
        // @ts-ignore
        children,
        {
          component: {
            ...component,
            props: propsWithOverwrites,
          },
          ...droppable,
          id: component.id,
          pos: "relative",
          isPreviewMode,
          style: childStyles,
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
