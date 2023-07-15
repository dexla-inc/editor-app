import { SortableTreeItem } from "@/components/SortableTreeItem";
import { useDraggable } from "@/hooks/useDraggable";
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
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure, useHover } from "@mantine/hooks";
import { IconChevronDown } from "@tabler/icons-react";
import { useEffect } from "react";

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
    (state) => state.selectedComponentId
  );
  const setSelectedComponentId = useEditorStore(
    (state) => state.setSelectedComponentId
  );
  const [opened, { toggle, open }] = useDisclosure(false);

  const onDragStart = useOnDragStart();

  const draggable = useDraggable({
    id: `layer-${component.id}`,
    onDragStart,
  });

  const handleSelection = (id: string) => {
    if (id !== "root") {
      setSelectedComponentId(id as string);
    }
  };

  const canExpand = (component.children ?? [])?.length > 0;
  const isCurrentTarget = currentTargetId === `layer-${component.id}`;

  useEffect(() => {
    const isAncestorOfSelectedComponent =
      component.id && selectedComponentId
        ? checkIfIsDirectAncestor(
            editorTree.root,
            selectedComponentId,
            component.id
          )
        : false;

    if (
      component.id === selectedComponentId ||
      isAncestorOfSelectedComponent ||
      isCurrentTarget
    ) {
      open();
    }
  }, [
    selectedComponentId,
    open,
    component.id,
    isCurrentTarget,
    editorTree.root,
  ]);

  const icon = structureMapper[component.name as string]?.icon;

  return (
    <>
      <Card
        ref={ref}
        p={`0 ${15 * level}px`}
        w="100%"
        bg={hovered ? "gray.1" : undefined}
        style={{
          cursor: "move",
          border:
            selectedComponentId === component.id
              ? `1px solid ${theme.colors.teal[6]}`
              : undefined,
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleSelection(component.id as string);
        }}
      >
        <Group position="apart" noWrap>
          <Group spacing={4} noWrap w="100%">
            <ActionIcon
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggle();
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
            <Text
              id={`layer-${component.id}`}
              size="xs"
              lineClamp={1}
              sx={{ cursor: "move", width: "100%" }}
              {...draggable}
            >
              {component.id === "root" ? "Body" : component.name}
            </Text>
          </Group>
        </Group>
      </Card>
      <Collapse
        key={`${component.id}-${opened}`}
        in={component.id === "root" || opened}
      >
        {children}
      </Collapse>
    </>
  );
};

const ListItemWrapper = ({ component, children, level }: ListItemProps) => {
  return (
    <SortableTreeItem component={component}>
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
