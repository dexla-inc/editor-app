import { useEditorStore } from "@/stores/editor";
import { ICON_SIZE } from "@/utils/config";
import {
  Component,
  addComponent,
  closestEdge,
  getComponentById,
  getComponentParent,
  moveComponent,
  moveComponentToDifferentParent,
  removeComponent,
  removeComponentFromParent,
} from "@/utils/editor";
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
  MeasuringStrategy,
  useDraggable,
} from "@dnd-kit/core";
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
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown } from "@tabler/icons-react";
import { SortableTreeItem } from "@/components/SortableTreeItem";
import { useState } from "react";

type ListItemProps = {
  component: Component;
  draggableProps?: any;
} & CardProps;

const ListItem = ({ component, draggableProps, children }: ListItemProps) => {
  const theme = useMantineTheme();
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );
  const setSelectedComponentId = useEditorStore(
    (state) => state.setSelectedComponentId
  );
  const [opened, { toggle }] = useDisclosure(false);

  const handleSelection = (e: React.MouseEvent<HTMLElement>, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (id !== "root") {
      setSelectedComponentId(id as string);
    }
  };

  const canExpand = (component.children ?? [])?.length > 0;

  return (
    <>
      <Card
        p={0}
        w="100%"
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
          handleSelection(e, component.id as string);
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
            <Text
              size="xs"
              lineClamp={1}
              sx={{ cursor: "move", width: "100%" }}
              {...draggableProps}
            >
              {component.id === "root" ? "Body" : component.name}
            </Text>
          </Group>
        </Group>
      </Card>
      <Collapse in={opened}>{children}</Collapse>
    </>
  );
};

const ListItemWrapper = ({ component, children }: ListItemProps) => {
  const { attributes, listeners, ...draggableProps } = useDraggable({
    id: component.id as string,
  });

  return (
    <SortableTreeItem component={component} draggableProps={draggableProps}>
      <List.Item key={component.id} w="100%">
        <ListItem
          component={component}
          draggableProps={{ ...attributes, ...listeners }}
        >
          {(component.children ?? [])?.length > 0 && (
            <List
              size="xs"
              withPadding
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
  const dropTarget = useEditorStore((state) => state.dropTarget);
  const setDropTarget = useEditorStore((state) => state.setDropTarget);
  const clearDropTarget = useEditorStore((state) => state.clearDropTarget);
  const clearSelection = useEditorStore((state) => state.clearSelection);
  const setEditorTree = useEditorStore((state) => state.setTree);
  const setSelectedComponentId = useEditorStore(
    (state) => state.setSelectedComponentId
  );
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );
  const [isSorting, setIsSorting] = useState<boolean>(false);

  const renderList = (component: Component) => {
    if (!component) {
      return null;
    }

    return (
      <ListItemWrapper key={component.id} component={component}>
        {component.children?.map((child) => {
          return (
            <ListItemWrapper key={child.id} component={child}>
              {child.children?.map(renderList)}
            </ListItemWrapper>
          );
        })}
      </ListItemWrapper>
    );
  };

  const getAllChildren = (component: Component): Component[] => {
    let children: Component[] = [];

    for (const child of component.children ?? []) {
      children.push(child);
      children = children.concat(getAllChildren(child));
    }

    return children;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active } = event;

    if (!dropTarget || dropTarget.id === active.id || !active) {
      clearDropTarget();
      return;
    }

    const copy = { ...editorTree };
    const activeComponent = getComponentById(copy.root, active.id as string);

    if (dropTarget?.id !== "root") {
      const activeParent = getComponentParent(copy.root, active.id as string);
      const targetParent = getComponentParent(
        copy.root,
        dropTarget.id as string
      );

      if (activeParent?.id !== targetParent?.id) {
        // move to a new parent
        moveComponentToDifferentParent(
          copy.root,
          active.id as string,
          dropTarget,
          targetParent!.id as string
        );
        removeComponentFromParent(
          copy.root,
          active.id as string,
          activeParent!.id as string
        );
      } else {
        // reorder
        moveComponent(copy.root, active.id as string, dropTarget);
      }
    } else {
      removeComponent(copy.root, active.id as string);
      addComponent(
        copy.root,
        activeComponent as unknown as Component,
        dropTarget
      );
    }

    setEditorTree(copy);
    clearDropTarget();
  };

  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id;
    setSelectedComponentId(id as string);
    setIsSorting(true);
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const id = event.collisions?.[0]?.id;
    const data = event.collisions?.[0]?.data;
    const target = {
      id: id as string,
      edge: data?.edge,
      rect: data?.rect,
    };
    setDropTarget(target);
  };

  const handleDragCancel = () => {
    clearDropTarget();
    clearSelection();
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
      collisionDetection={(args) => {
        return closestEdge(args, editorTree);
      }}
    >
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
        <DragOverlay>
          {selectedComponentId &&
            isSorting &&
            renderList(
              getComponentById(
                editorTree.root as Component,
                selectedComponentId as string
              ) as Component
            )}
        </DragOverlay>
      </List>
    </DndContext>
  );
};
