import { Icon } from "@/components/Icon";
import { SortableTreeItem } from "@/components/SortableTreeItem";
import { useDraggable } from "@/hooks/useDraggable";
import { useMemoizedDebounce } from "@/hooks/useMemoizedDebounce";
import { useOnDragStart } from "@/hooks/useOnDragStart";
import { useEditorStore } from "@/stores/editor";
import { structureMapper } from "@/utils/componentMapper";
import { ICON_SIZE } from "@/utils/config";
import { Component, checkIfIsDirectAncestor } from "@/utils/editor";
import {
  ActionIcon,
  Card,
  CardProps,
  Collapse,
  Group,
  List,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure, useHover } from "@mantine/hooks";
import { IconChevronDown } from "@tabler/icons-react";
import debounce from "lodash.debounce";
import { KeyboardEvent, useEffect, useRef, useState } from "react";

type ListItemProps = {
  component: Component;
  level?: number;
} & CardProps;

const ListItem = ({ component, children, level = 0 }: ListItemProps) => {
  const theme = useMantineTheme();
  const { ref, hovered } = useHover();
  const editorTree = useEditorStore((state) => state.tree);
  const currentTargetId = useEditorStore((state) => state.currentTargetId);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
  );
  const setSelectedComponentId = useEditorStore(
    (state) => state.setSelectedComponentId,
  );
  const updateTreeComponentDescription = useEditorStore(
    (state) => state.updateTreeComponentDescription,
  );
  const isStructureCollapsed = useEditorStore(
    (state) => state.isStructureCollapsed,
  );

  const [opened, { toggle, open, close }] = useDisclosure(
    isStructureCollapsed ? false : true,
  );
  const [clickedManualToggle, setClickedManualToggle] = useState(false);
  const [editable, { toggle: toggleEdit, close: closeEdit }] =
    useDisclosure(false);
  const editFieldRef = useRef<HTMLInputElement>(null);
  const onDragStart = useOnDragStart();

  const draggable = useDraggable({
    id: `layer-${component.id}`,
    onDragStart,
  });

  const form = useForm({
    initialValues: {
      value: component.description,
    },
  });

  const handleSelection = (id: string) => {
    if (id !== "root") {
      setSelectedComponentId(id as string);
    }
  };

  const canExpand = (component.children ?? [])?.length > 0;
  const isCurrentTarget = currentTargetId === `layer-${component.id}`;

  const debouncedUpdate = debounce((value: string) => {
    updateTreeComponentDescription(selectedComponentId as string, value);
  }, 500);

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "Escape") closeEdit();
  };

  const onDragEnter = useMemoizedDebounce(() => {
    const isAncestorOfSelectedComponent =
      component.id && selectedComponentId
        ? checkIfIsDirectAncestor(
            editorTree.root,
            selectedComponentId,
            component.id,
          )
        : false;

    if (
      (component.id === selectedComponentId ||
        isAncestorOfSelectedComponent ||
        isCurrentTarget) &&
      !clickedManualToggle
    ) {
      open();
    }
  }, 200);

  useEffect(() => {
    setClickedManualToggle(false);
  }, [selectedComponentId]);
  useEffect(onDragEnter, [onDragEnter]);
  useEffect(() => {
    if (editable) {
      editFieldRef?.current?.focus();
    }
  }, [editable]);

  useEffect(() => {
    if (isStructureCollapsed) {
      close();
      setClickedManualToggle(true);
    } else {
      open();
      setClickedManualToggle(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStructureCollapsed]);

  const icon = structureMapper[component.name as string]?.icon;
  const componentActions = component.actions;

  return (
    <Group
      unstyled
      w="100%"
      {...(isCurrentTarget && { className: "is-drag-over" })}
      style={{
        borderLeft: "1px solid transparent",
      }}
      sx={(theme) =>
        component.id !== "root"
          ? {
              padding: "0 0 0 10px",
              "&:has(.is-drag-over)": {
                borderLeft: `1px solid ${theme.colors.teal[6]}!important`,
              },
            }
          : {}
      }
    >
      <Card
        ref={ref}
        w="100%"
        p={0}
        bg={hovered ? "gray.1" : undefined}
        sx={{
          cursor: "move",
          border:
            selectedComponentId === component.id
              ? `1px solid ${theme.colors.teal[6]}`
              : undefined,
          display: "flex",
          position: "relative",
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleSelection(component.id as string);
        }}
        onDoubleClick={toggleEdit}
        onBlur={closeEdit}
        onKeyDown={handleKeyPress}
      >
        <Group position="apart" noWrap w="100%">
          <Group
            spacing={4}
            noWrap
            w="100%"
            sx={{ backgroundColor: `${editable && "white"}` }}
          >
            <ActionIcon
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggle();
                setClickedManualToggle(true);
              }}
              sx={{
                visibility: canExpand ? "visible" : "hidden",
                pointerEvents: canExpand ? "all" : "none",
                width: canExpand ? "auto" : 0,
                minWidth: canExpand ? "auto" : 0,
                cursor: "pointer",
              }}
            >
              <IconChevronDown
                size={ICON_SIZE}
                style={{
                  transition: "transform 200ms ease",
                  transform: opened ? `none` : "rotate(-90deg)",
                }}
              />
            </ActionIcon>
            {component.id !== "root" && icon}
            {component.id === "root" || component.id === "content-wrapper" ? (
              <Text
                id={`layer-${component.id}`}
                size="xs"
                lineClamp={1}
                sx={{ cursor: "move", width: "100%" }}
                {...draggable}
              >
                {component.id === "root" ? "Body" : "Content Wrapper"}
              </Text>
            ) : editable ? (
              <TextInput
                ref={editFieldRef}
                id={`layer-${component.id}`}
                size="xs"
                w="100%"
                variant="unstyled"
                {...form.getInputProps("value")}
                onChange={(e) => {
                  e.preventDefault();
                  form.setFieldValue("value", e.target.value);
                  debouncedUpdate(e.target.value);
                }}
              />
            ) : (
              <Text
                id={`layer-${component.id}`}
                size="xs"
                lineClamp={1}
                sx={{ cursor: "move", width: "100%" }}
                {...draggable}
              >
                {component.description}
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
      </Card>
      <Collapse
        key={`${component.id}-${opened}`}
        in={component.id === "root" || opened}
      >
        {children}
      </Collapse>
    </Group>
  );
};

const ListItemWrapper = ({ component, children, level }: ListItemProps) => {
  return (
    <SortableTreeItem
      component={component}
      style={{ marginBottom: "3px", overflow: "hidden" }}
    >
      <List.Item key={component.id} w="100%">
        <ListItem component={component} level={level}>
          {(component.children ?? [])?.length > 0 && (
            <List
              size="xs"
              listStyleType="none"
              styles={{
                itemWrapper: {
                  width: "100%",
                },
              }}
            >
              {children}
            </List>
          )}
        </ListItem>
      </List.Item>
    </SortableTreeItem>
  );
};

export const EditorNavbarLayersSection = () => {
  const editorTree = useEditorStore((state) => state.tree);

  const renderList = (component: Component, level: number = 0) => {
    if (!component) {
      return null;
    }

    return (
      <ListItemWrapper key={component.id} component={component} level={level}>
        {component.children?.map((child) => {
          return renderList(child, level + 1);
        })}
      </ListItemWrapper>
    );
  };

  return (
    <List
      size="xs"
      listStyleType="none"
      styles={{
        itemWrapper: {
          width: "100%",
        },
      }}
    >
      {renderList(editorTree.root)}
    </List>
  );
};
