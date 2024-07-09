import classNames from "classnames";
import React, {
  forwardRef,
  HTMLAttributes,
  KeyboardEvent,
  useEffect,
  useRef,
} from "react";

import styles from "@/components/navbar/PageStructure/components/TreeItem/TreeItem.module.scss";
import { useComponentContextMenu } from "@/hooks/components/useComponentContextMenu";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useUserConfigStore } from "@/stores/userConfig";
import { DARK_COLOR, GRAY_WHITE_COLOR } from "@/utils/branding";
import { AUTOCOMPLETE_OFF_PROPS } from "@/utils/common";
import { structureMapper } from "@/utils/componentMapper";
import { ICON_SIZE } from "@/utils/config";
import {
  Component,
  ComponentTree,
  debouncedTreeComponentAttrsUpdate,
} from "@/utils/editor";
import {
  ActionIcon,
  Card,
  Flex,
  Group,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import {
  IconBolt,
  IconChevronDown,
  IconDatabase,
  IconEyeOff,
} from "@tabler/icons-react";
import { useShallow } from "zustand/react/shallow";
import isEmpty from "lodash.isempty";
import { useComputeValue } from "@/hooks/data/useComputeValue";
import { isSelectedSelector } from "@/utils/componentSelectors";
import { useEditorStore } from "@/stores/editor";

export interface Props extends Omit<HTMLAttributes<HTMLLIElement>, "id"> {
  id: any;
  childCount?: number;
  clone?: boolean;
  collapsed?: boolean;
  depth: number;
  disableInteraction?: boolean;
  disableSelection?: boolean;
  ghost?: boolean;
  handleProps?: any;
  indicator?: boolean;
  indentationWidth: number;
  onCollapse?(): void;
  onRemove?(): void;
  wrapperRef?(node: HTMLLIElement): void;
  component: ComponentTree;
}

// eslint-disable-next-line react/display-name
export const TreeItem = forwardRef<HTMLDivElement, Props>(
  (
    {
      clone,
      depth,
      disableSelection,
      disableInteraction,
      ghost,
      handleProps,
      indentationWidth,
      indicator,
      collapsed,
      onCollapse,
      onRemove,
      style,
      id,
      wrapperRef,
      component: componentTree,
      ...props
    },
    ref,
  ) => {
    const customRef = useRef<HTMLDivElement>(null!);
    const theme = useMantineTheme();
    const [editable, { toggle: toggleEdit, close: closeEdit }] =
      useDisclosure(false);
    const editFieldRef = useRef<HTMLInputElement>(null);
    const isSelected = useEditorTreeStore(
      useShallow(isSelectedSelector(id as string)),
    );
    const setSelectedComponentIds = useEditorTreeStore(
      (state) => state.setSelectedComponentIds,
    );
    const isDarkTheme = useUserConfigStore((state) => state.isDarkTheme);
    const iframeWindow = useEditorStore((state) => state.iframeWindow);
    const component = useEditorTreeStore(
      useShallow((state) => {
        const c = state.componentMutableAttrs[componentTree.id!];
        return {
          actions: c?.actions?.length,
          endpointId: c?.onLoad?.endpointId,
          display: c?.props?.style?.display,
          description: c?.description,
          name: c?.name,
          onLoad: {
            endpointId: c?.onLoad?.endpointId,
            isVisible: c?.onLoad?.isVisible,
          },
        };
      }),
    );

    const { isVisible = true, endpointId } = useComputeValue({
      onLoad: component.onLoad,
    });

    const { componentContextMenu, forceDestroyContextMenu } =
      useComponentContextMenu();

    const form = useForm({
      initialValues: {
        value: component.description,
      },
    });

    const handleSelection = (
      e: React.MouseEvent<HTMLLIElement>,
      id: string,
    ) => {
      if (id !== "root") {
        const comp =
          iframeWindow?.document?.querySelector(`[data-id^="${id}"]`) ??
          iframeWindow?.document?.querySelector(`[id^="${id}"]`);

        const newId = (
          comp?.getAttribute("data-id") ??
          comp?.getAttribute("id")! ??
          id
        ).replace(/-(title|target)$/, "");

        if (e.ctrlKey || e.metaKey) {
          setSelectedComponentIds((prev) => {
            if (prev.includes(newId)) {
              return prev.filter((p) => p !== newId);
            }
            return [...prev, newId];
          });
        } else {
          setSelectedComponentIds(() => [newId]);
        }
      }
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "Escape") closeEdit();
    };

    const icon = structureMapper[component.name as string]?.icon;

    // useEffect(() => {
    //   const isRootOrContentWrapper = id === "root" || id === "content-wrapper";
    //   if (isSelected && !isRootOrContentWrapper) {
    //     customRef.current?.scrollIntoView({
    //       behavior: "smooth",
    //       block: "center",
    //     });
    //   }
    //
    //   // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [isSelected]);

    return (
      <li
        className={classNames(
          styles.Wrapper,
          clone && styles.clone,
          ghost && styles.ghost,
          indicator && styles.indicator,
          disableSelection && styles.disableSelection,
          disableInteraction && styles.disableInteraction,
        )}
        ref={wrapperRef}
        style={
          {
            "--spacing": `${indentationWidth * depth}px`,
          } as React.CSSProperties
        }
        {...props}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          forceDestroyContextMenu();
          if (!editable) {
            handleSelection(e, id as string);
          }
        }}
        onDoubleClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleEdit();
        }}
        {...(editable && { onKeyDown: handleKeyPress })}
        onContextMenu={componentContextMenu({
          id,
          name: component.name,
        } as Component)}
      >
        <div
          className={classNames(styles.TreeItem, isDarkTheme && styles.dark)}
          ref={ref}
          style={{
            ...style,
            border: isSelected
              ? `1px solid ${theme.colors.teal[6]}`
              : undefined,
          }}
          {...handleProps}
        >
          <Group position="apart" noWrap w="100%" ref={customRef}>
            <Group
              spacing={4}
              noWrap
              w="100%"
              align="center"
              sx={(theme) => ({
                backgroundColor: `${
                  editable &&
                  (theme.colorScheme === "dark" ? DARK_COLOR : GRAY_WHITE_COLOR)
                }`,
              })}
            >
              {onCollapse && (
                <ActionIcon
                  onClick={onCollapse}
                  sx={{
                    pointerEvents: "all",
                    width: "auto",
                    minWidth: "auto",
                    cursor: "pointer",
                  }}
                >
                  <IconChevronDown
                    size={ICON_SIZE}
                    style={{
                      transition: "transform 200ms ease",
                      transform: !collapsed ? "none" : "rotate(-90deg)",
                    }}
                  />
                </ActionIcon>
              )}
              {!onCollapse && (
                <Card unstyled w="18px" h="28px" p={0} bg="transparent">
                  {" "}
                </Card>
              )}
              {id !== "root" && (
                <div
                  className={classNames(isDarkTheme && styles.darkThemeIcon)}
                  style={{ height: 22 }}
                >
                  {icon}
                </div>
              )}
              {id === "root" || id === "content-wrapper" ? (
                <Text
                  id={`layer-${id}`}
                  size="0.72rem"
                  lineClamp={1}
                  sx={{ cursor: "move", width: "100%" }}
                >
                  Body
                </Text>
              ) : editable ? (
                <TextInput
                  ref={editFieldRef}
                  id={`layer-${id}`}
                  w="100%"
                  variant="unstyled"
                  {...form.getInputProps("value")}
                  onChange={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.setFieldValue("value", e.target.value);
                    debouncedTreeComponentAttrsUpdate({
                      attrs: {
                        description: e.target.value,
                      },
                    });
                  }}
                  onBlur={closeEdit}
                  autoFocus
                  {...AUTOCOMPLETE_OFF_PROPS}
                />
              ) : (
                <Text
                  id={`layer-${id}`}
                  size="0.72rem"
                  lineClamp={1}
                  sx={{ cursor: "move", width: "100%" }}
                >
                  {component.description}
                </Text>
              )}
            </Group>
          </Group>
          <Flex gap={4}>
            {!!component.actions && <IconBolt size={ICON_SIZE} />}
            {!isVisible && <IconEyeOff size={ICON_SIZE} />}
            {component.display === "none" && (
              <IconEyeOff size={ICON_SIZE} color="red" />
            )}
            {!isEmpty(endpointId) && <IconDatabase size={ICON_SIZE} />}
          </Flex>
        </div>
      </li>
    );
  },
);
