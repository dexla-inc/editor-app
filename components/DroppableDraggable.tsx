import { useDraggable } from "@/hooks/useDraggable";
import { useDroppable } from "@/hooks/useDroppable";
import { useOnDragStart } from "@/hooks/useOnDragStart";
import { useOnDrop } from "@/hooks/useOnDrop";
import { useEditorStore } from "@/stores/editor";
import { Action, actionMapper } from "@/utils/actions";
import { DROP_INDICATOR_WIDTH, ICON_SIZE } from "@/utils/config";
import { Component, getComponentParent } from "@/utils/editor";
import {
  ActionIcon,
  Box,
  BoxProps,
  Group,
  Text,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import {
  IconArrowUp,
  IconDeviceFloppy,
  IconGripVertical,
  IconNewSection,
} from "@tabler/icons-react";
import { Router, useRouter } from "next/router";
import { PropsWithChildren, cloneElement, useEffect } from "react";

type Props = {
  id: string;
  component: Component;
  customComponentModal: any;
} & BoxProps;

const bidingComponentsWhitelist = { from: ["Input"], to: ["Text", "Title"] };
const nonDefaultActionTriggers = ["onMount", "onSuccess", "onError"];

export const DroppableDraggable = ({
  id,
  children,
  component,
  customComponentModal,
}: PropsWithChildren<Props>) => {
  const router = useRouter();
  const { hovered, ref } = useHover();
  const theme = useMantineTheme();
  const editorTree = useEditorStore((state) => state.tree);
  const iframeWindow = useEditorStore((state) => state.iframeWindow);
  const currentTargetId = useEditorStore((state) => state.currentTargetId);
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);
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
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );

  const actions = component.props?.actions ?? [];
  const onMountAction: Action = actions.find(
    (action: Action) => action.trigger === "onMount"
  );

  const onSuccessAction: Action = actions.find(
    (action: Action) => action.sequentialTrigger === "onSuccess"
  );

  const onErrorAction: Action = actions.find(
    (action: Action) => action.sequentialTrigger === "onError"
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
            router: router as Router,
            event: e,
            onSuccess: onSuccessAction?.action as any,
            onError: onErrorAction?.action as any,
            component,
          }),
      };
    }, {});

  useEffect(() => {
    if (onMountAction && isPreviewMode) {
      actionMapper[onMountAction.action.name].action({
        // @ts-ignore
        action: onMountAction.action,
        router: router as Router,
        onSuccess: onSuccessAction?.action as any,
        onError: onErrorAction?.action as any,
        component,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPreviewMode]);

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

  const pickingData = pickingComponentToBindFrom
    ? pickingComponentToBindFrom.split("++")
    : pickingComponentToBindTo
    ? pickingComponentToBindTo.split("++")
    : [];

  const isPicked = isPicking && pickingData[pickingData.length - 1] === id;

  const isSelected = selectedComponentId === id && !isPreviewMode;
  const isOver =
    (currentTargetId === id || hovered) &&
    !isPreviewMode &&
    (isPicking ? canBePickedAndUserIsPicking : true);

  const baseShadow = `0 0 0 1px ${theme.colors.teal[6]}`;

  const shadows =
    isOver || isPicked
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
        }
      : isSelected
      ? { boxShadow: baseShadow }
      : {};

  const isContentWrapper = id === "content-wrapper";
  const haveNonRootParent = parent && parent.id !== "root";

  // Whitelist certain props that can be passed down
  const styleWhitelist = [
    "display",
    "flexDirection",
    "flexGrow",
    "borderBottomLeftRadius",
    "borderBottomRightRadius",
    "borderTopLeftRadius",
    "borderTopRightRadius",
  ];
  const filteredProps = {
    ...component.props,
    style: Object.keys(component.props?.style || {}).reduce((newStyle, key) => {
      if (styleWhitelist.includes(key)) {
        newStyle[key] = component.props?.style[key];
      }
      return newStyle;
    }, {} as Record<string, unknown>),
  };

  return (
    <Box
      ref={ref}
      id={id}
      pos="relative"
      sx={{
        width: component.props?.style?.width ?? "auto",
        ...shadows,
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
    >
      <Box
        w="100%"
        h="auto"
        pos="relative"
        sx={{
          display: "flex",
        }}
        {...droppable}
      >
        {cloneElement(
          // @ts-ignore
          children,
          {
            component: {
              ...component,
              props: {
                ...component.props,
                triggers: isPreviewMode
                  ? { ...triggers, onMouseEnter: triggers?.onHover }
                  : {},
              },
            },
            isPreviewMode,
          },
          // @ts-ignore
          children?.children
        )}
      </Box>
      {!isContentWrapper && (
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
            {!component.props?.fixedPosition && (
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
              {component.name}
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
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <IconDeviceFloppy
                size={ICON_SIZE}
                color="white"
                strokeWidth={1.5}
              />
            </ActionIcon>
          </Group>
        </Box>
      )}
    </Box>
  );
};
