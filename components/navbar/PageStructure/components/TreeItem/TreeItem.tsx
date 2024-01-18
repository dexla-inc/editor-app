import classNames from "classnames";
import React, {
  forwardRef,
  HTMLAttributes,
  KeyboardEvent,
  useEffect,
  useRef,
} from "react";

import styles from "@/components/navbar/PageStructure/components/TreeItem/TreeItem.module.scss";
import { useComponentContextMenu } from "@/hooks/useComponentContextMenu";
import { useEditorStore } from "@/stores/editor";
import { useUserConfigStore } from "@/stores/userConfig";
import { DARK_COLOR, GRAY_WHITE_COLOR } from "@/utils/branding";
import { structureMapper } from "@/utils/componentMapper";
import { ICON_SIZE } from "@/utils/config";
import {
  Component,
  debouncedTreeComponentDescriptionpdate,
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

export interface Props extends Omit<HTMLAttributes<HTMLLIElement>, "id"> {
  id: any;
  name: string;
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
  value: string;
  onCollapse?(): void;
  onRemove?(): void;
  wrapperRef?(node: HTMLLIElement): void;
  component: Component;
}

// eslint-disable-next-line react/display-name
export const TreeItem = forwardRef<HTMLDivElement, Props>(
  (
    {
      childCount,
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
      value,
      id,
      name,
      wrapperRef,
      component,
      ...props
    },
    ref,
  ) => {
    const customRef = useRef<HTMLDivElement>(null!);
    const theme = useMantineTheme();
    const [editable, { toggle: toggleEdit, close: closeEdit }] =
      useDisclosure(false);
    const editFieldRef = useRef<HTMLInputElement>(null);
    const isSelected = useEditorStore(
      (state) => state.selectedComponentIds?.includes(id),
    );
    const setSelectedComponentId = useEditorStore(
      (state) => state.setSelectedComponentId,
    );
    const setSelectedComponentIds = useEditorStore(
      (state) => state.setSelectedComponentIds,
    );
    const isDarkTheme = useUserConfigStore((state) => state.isDarkTheme);

    const { componentContextMenu, forceDestroyContextMenu } =
      useComponentContextMenu();

    const form = useForm({
      initialValues: {
        value,
      },
    });

    const handleSelection = (
      e: React.MouseEvent<HTMLLIElement>,
      id: string,
    ) => {
      if (id !== "root") {
        setSelectedComponentId(id as string);
        if (e.ctrlKey || e.metaKey) {
          setSelectedComponentIds((prev) => {
            if (prev.includes(id)) {
              return prev.filter((p) => p !== id);
            }
            return [...prev, id];
          });
        } else {
          setSelectedComponentIds(() => [id]);
        }
      }
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "Escape") closeEdit();
    };

    const icon = structureMapper[name as string]?.icon;
    const componentActions = component.actions;

    useEffect(() => {
      const isRootOrContentWrapper = id === "root" || id === "content-wrapper";
      if (isSelected && !isRootOrContentWrapper) {
        customRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSelected]);

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
        onKeyDown={handleKeyPress}
        onContextMenu={componentContextMenu(component)}
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
                  className={classNames(
                    styles.Collapse,
                    collapsed && styles.collapsed,
                  )}
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
                      transform: !collapsed ? `none` : "rotate(-90deg)",
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
                  size="xs"
                  lineClamp={1}
                  sx={{ cursor: "move", width: "100%" }}
                >
                  Body
                </Text>
              ) : editable ? (
                <TextInput
                  ref={editFieldRef}
                  id={`layer-${id}`}
                  size="xs"
                  w="100%"
                  variant="unstyled"
                  {...form.getInputProps("value")}
                  onChange={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.setFieldValue("value", e.target.value);
                    debouncedTreeComponentDescriptionpdate(e.target.value);
                  }}
                  onBlur={closeEdit}
                  autoFocus
                />
              ) : (
                <Text
                  id={`layer-${id}`}
                  size="xs"
                  lineClamp={1}
                  sx={{ cursor: "move", width: "100%" }}
                >
                  {value}
                </Text>
              )}
            </Group>
          </Group>
          <Flex gap={4}>
            {componentActions && !!componentActions.length && (
              <IconBolt size={ICON_SIZE} />
            )}
            {component.props?.style?.display === "none" && (
              <IconEyeOff size={ICON_SIZE} />
            )}
            {component.onLoad?.endpointId && <IconDatabase size={ICON_SIZE} />}
          </Flex>
        </div>
      </li>
    );
  },
);
