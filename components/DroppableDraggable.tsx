import { useDraggable } from "@/hooks/useDraggable";
import { useDroppable } from "@/hooks/useDroppable";
import { useOnDragStart } from "@/hooks/useOnDragStart";
import { useOnDrop } from "@/hooks/useOnDrop";
import { useEditorStore } from "@/stores/editor";
import { Action, actionMapper } from "@/utils/actions";
import { structureMapper } from "@/utils/componentMapper";
import { DROP_INDICATOR_WIDTH, ICON_SIZE } from "@/utils/config";
import {
  Component,
  addComponent,
  getComponentIndex,
  getComponentParent,
  removeComponentFromParent,
} from "@/utils/editor";
import {
  ActionIcon,
  Box,
  BoxProps,
  Group,
  Text,
  Tooltip,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import {
  IconArrowUp,
  IconBoxMargin,
  IconGripVertical,
  IconNewSection,
} from "@tabler/icons-react";
import cloneDeep from "lodash.clonedeep";
import { Router, useRouter } from "next/router";
import { Fragment, PropsWithChildren, cloneElement, useEffect } from "react";

type Props = {
  id: string;
  component: Component;
  customComponentModal: any;
} & BoxProps;

const bidingComponentsWhitelist = {
  from: ["Input"],
  to: ["Text", "Title", "Table", "Container", "Image"],
};
const nonDefaultActionTriggers = ["onMount", "onSuccess", "onError"];
// Whitelist certain props that can be passed down
const styleWhitelist = [
  "borderTopLeftRadius",
  "borderTopRightRadius",
  "borderBottomLeftRadius",
  "borderBottomRightRadius",
  "position",
  "top",
  "left",
  "right",
  "bottom",
  "background",
  "backgroundColor",
  "margin",
  "marginTop",
  "marginBottom",
  "marginLeft",
  "marginRight",
];
const handlerBlacklist = ["Modal"];

export const DroppableDraggable = ({
  id,
  children,
  component,
  customComponentModal,
}: PropsWithChildren<Props>) => {
  const router = useRouter();
  const { hovered, ref } = useHover();
  const theme = useMantineTheme();
  const editorTheme = useEditorStore((state) => state.theme);
  const editorTree = useEditorStore((state) => state.tree);
  const setEditorTree = useEditorStore((state) => state.setTree);
  const iframeWindow = useEditorStore((state) => state.iframeWindow);
  const currentTargetId = useEditorStore((state) => state.currentTargetId);
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);
  const onMountActionsRan = useEditorStore((state) => state.onMountActionsRan);
  const addOnMountActionsRan = useEditorStore(
    (state) => state.addOnMountActionsRan
  );
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind
  );
  const pickingComponentToBindFrom = useEditorStore(
    (state) => state.pickingComponentToBindFrom
  );
  const pickingComponentToBindTo = useEditorStore(
    (state) => state.pickingComponentToBindTo
  );
  const setSelectedComponentId = useEditorStore(
    (state) => state.setSelectedComponentId
  );
  const setTreeComponentCurrentState = useEditorStore(
    (state) => state.setTreeComponentCurrentState
  );
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );
  const currentTreeComponentsStates = useEditorStore(
    (state) => state.currentTreeComponentsStates
  );

  const actions: Action[] = component.actions ?? [];
  const onMountAction: Action | undefined = actions.find(
    (action: Action) => action.trigger === "onMount"
  );

  const onSuccessActions: Action[] = actions.filter(
    (action: Action) => action.trigger === "onSuccess"
  );

  const onErrorActions: Action[] = actions.filter(
    (action: Action) => action.trigger === "onError"
  );

  const triggers = actions
    .filter(
      (action: Action) => !nonDefaultActionTriggers.includes(action.trigger)
    )
    .reduce((triggers: object, action: Action) => {
      return {
        ...triggers,
        [action.trigger]: (e: any) =>
          actionMapper[action.action.name].action({
            // @ts-ignore
            action: action.action,
            actionId: action.id,
            router: router as Router,
            event: e,
            onSuccess: onSuccessActions.find(
              (sa) => sa.sequentialTo === action.id
            ),
            onError: onErrorActions.find((ea) => ea.sequentialTo === action.id),
            component,
          }),
      };
    }, {});

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
          (sa) => sa.sequentialTo === onMountAction.id
        ),
        onError: onErrorActions.find(
          (ea) => ea.sequentialTo === onMountAction.id
        ),
        component,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPreviewMode, onMountAction, onMountActionsRan, component]);

  const parent = getComponentParent(editorTree.root, id);

  const onDragStart = useOnDragStart();
  const onDrop = useOnDrop();

  const draggable = useDraggable({
    id,
    onDragStart,
    currentWindow: iframeWindow,
  });
  const { edge, ...droppable } = useDroppable({
    id,
    activeId: selectedComponentId,
    onDrop,
    currentWindow: iframeWindow,
  });

  const isPicking = pickingComponentToBindFrom || pickingComponentToBindTo;

  const canBePickedAndUserIsPicking =
    isPicking &&
    bidingComponentsWhitelist[
      pickingComponentToBindFrom ? "from" : "to"
    ].includes(component.name);

  const pickingData = pickingComponentToBindFrom ?? pickingComponentToBindTo;

  const isPicked = isPicking && pickingData?.componentId === id;

  const isSelected = selectedComponentId === id && !isPreviewMode;
  const isOver =
    currentTargetId === id &&
    !isPreviewMode &&
    (isPicking ? canBePickedAndUserIsPicking : true);

  const baseShadow = `0 0 0 1px ${theme.colors.teal[6]}`;

  const shadows =
    !isPreviewMode &&
    (isOver || isPicked
      ? {
          boxShadow:
            edge === "top"
              ? `inset 0 ${DROP_INDICATOR_WIDTH}px 0 0 ${theme.colors.teal[6]}, ${baseShadow}`
              : edge === "bottom"
              ? `inset 0 -${DROP_INDICATOR_WIDTH}px 0 0 ${theme.colors.teal[6]}, ${baseShadow}`
              : edge === "left"
              ? `inset ${DROP_INDICATOR_WIDTH}px 0 0 0 ${theme.colors.teal[6]}, ${baseShadow}`
              : edge === "right"
              ? `inset -${DROP_INDICATOR_WIDTH}px 0 0 0 ${theme.colors.teal[6]}, ${baseShadow}`
              : baseShadow,
          background: edge === "center" ? theme.colors.teal[6] : "none",
          opacity: edge === "center" ? 0.4 : 1,
        }
      : isSelected || hovered
      ? { boxShadow: baseShadow }
      : {});

  const isContentWrapper = id === "content-wrapper";
  const haveNonRootParent = parent && parent.id !== "root";

  const filteredProps = {
    style: Object.keys(component.props?.style || {}).reduce((newStyle, key) => {
      if (styleWhitelist.includes(key)) {
        newStyle[key] = component.props?.style[key];
      }
      return newStyle;
    }, {} as Record<string, unknown>),
  };

  const isModal = component.name === "Modal";
  const hasTooltip = !!component.props?.tooltip;
  const ComponentWrapper = hasTooltip ? Tooltip : Fragment;

  const currentState =
    currentTreeComponentsStates?.[component.id!] ?? "default";

  const isDefaultState = currentState === "default";
  const hoverStateFunc = () => {
    setTreeComponentCurrentState(component.id!, "hover");
  };
  const leaveHoverStateFunc = () => {
    setTreeComponentCurrentState(component.id!, "default");
  };

  const isWidthPercentage = component.props?.style?.width?.endsWith("%");
  const isHeightPercentage = component.props?.style?.height?.endsWith("%");

  const propsWithOverwrites = {
    ...component.props,
    ...(isDefaultState ? {} : component.states?.[currentState] ?? {}),
    ...(isModal
      ? {
          style: {
            ...(isDefaultState
              ? component.props?.style ?? {}
              : component.states?.[currentState].props ?? {}),
            ...shadows,
          },
        }
      : {}),
    ...{
      style: {
        ...component?.props?.style,
        width: isWidthPercentage ? "100%" : component.props?.style?.width,
        height: isHeightPercentage ? "100%" : component.props?.style?.height,
        position: "static",
      },
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
  };

  return (
    <Box
      ref={ref}
      id={id}
      pos="relative"
      sx={{
        width: component.props?.style?.width
          ? component.props?.style?.width
          : "auto",
        height: component.props?.style?.height
          ? component.props?.style?.height
          : "auto",
        "&:before": {
          ...(!isPreviewMode ? shadows : {}),
          content: '""',
          position: "absolute",
          pointerEvents: "none",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 80,
        },
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isPicking) {
          if (canBePickedAndUserIsPicking) {
            setComponentToBind(id);
          }
        } else {
          setSelectedComponentId(id);
        }
      }}
      {...filteredProps}
      {...droppable}
    >
      {/* @ts-ignore */}
      <ComponentWrapper
        {...(hasTooltip ? { label: component.props?.tooltip } : {})}
      >
        {cloneElement(
          // @ts-ignore
          children,
          {
            component: {
              ...component,
              props: propsWithOverwrites,
            },
            isPreviewMode,
          },
          // @ts-ignore
          children?.children
        )}
      </ComponentWrapper>
      {!isContentWrapper && !handlerBlacklist.includes(component.name) && (
        <Box
          pos="absolute"
          h={36}
          top={-36}
          sx={{
            zIndex: 90,
            display: isSelected ? "block" : "none",
            background: theme.colors.teal[6],
            borderTopLeftRadius: theme.radius.sm,
            borderTopRightRadius: theme.radius.sm,
          }}
        >
          <Group py={4} px={8} h={36} noWrap spacing="xs" align="center">
            {!component.fixedPosition && (
              <UnstyledButton
                sx={{ cursor: "move", alignItems: "center", display: "flex" }}
                {...draggable}
              >
                <IconGripVertical
                  size={ICON_SIZE}
                  color="white"
                  strokeWidth={1.5}
                />
              </UnstyledButton>
            )}
            <Text color="white" size="xs" pr={haveNonRootParent ? 0 : "xs"}>
              {component.description}
            </Text>
            {haveNonRootParent && (
              <ActionIcon
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
              variant="transparent"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                customComponentModal.open();
              }}
            >
              <IconNewSection
                size={ICON_SIZE}
                color="white"
                strokeWidth={1.5}
              />
            </ActionIcon>
            <ActionIcon
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
                  getComponentIndex(parent!, id)
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
          </Group>
        </Box>
      )}
    </Box>
  );
};
