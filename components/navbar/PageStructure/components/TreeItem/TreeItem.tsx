import React, {
  forwardRef,
  HTMLAttributes,
  KeyboardEvent,
  useEffect,
  useRef,
} from "react";
import classNames from "classnames";

import styles from "./TreeItem.module.scss";
import { ICON_SIZE } from "@/utils/config";
import { IconChevronDown } from "@tabler/icons-react";
import {
  ActionIcon,
  Card,
  Group,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { debouncedTreeComponentDescriptionpdate } from "@/utils/editor";
import { Icon } from "@/components/Icon";
import { structureMapper } from "@/utils/componentMapper";
import { useDisclosure } from "@mantine/hooks";
import { useComponentContextMenu } from "@/hooks/useComponentContextMenu";
import { useForm } from "@mantine/form";
import { useEditorStore } from "@/stores/editor";

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
  component: any;
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
    const customRef = useRef(null);
    const theme = useMantineTheme();
    const [editable, { toggle: toggleEdit, close: closeEdit }] =
      useDisclosure(false);
    const editFieldRef = useRef<HTMLInputElement>(null);
    const isSelected = useEditorStore(
      (state) => state.selectedComponentId === id,
    );
    const setSelectedComponentId = useEditorStore(
      (state) => state.setSelectedComponentId,
    );

    const { componentContextMenu, forceDestroyContextMenu } =
      useComponentContextMenu();

    const form = useForm({
      initialValues: {
        value,
      },
    });

    const handleSelection = (id: string) => {
      if (id !== "root") {
        setSelectedComponentId(id as string);
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
        // @ts-ignore
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
            handleSelection(id as string);
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
          className={styles.TreeItem}
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
              sx={{ backgroundColor: `${editable && "white"}` }}
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
              {id !== "root" && icon}
              {id === "root" || id === "content-wrapper" ? (
                <Text
                  id={`layer-${id}`}
                  size="xs"
                  lineClamp={1}
                  sx={{ cursor: "move", width: "100%" }}
                >
                  {id === "root" ? "Body" : "Content Wrapper"}
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
          {componentActions && !!componentActions.length && (
            <ActionIcon color="teal" variant="transparent" size={30}>
              <Icon name="IconBolt" size={ICON_SIZE} />
            </ActionIcon>
          )}
          {component.props?.style?.display === "none" && (
            <ActionIcon color="dark" variant="transparent" size={30}>
              <Icon name="IconEyeOff" size={ICON_SIZE} />
            </ActionIcon>
          )}
        </div>
      </li>
    );
  },
);
