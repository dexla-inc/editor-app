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
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconChevronDown,
  IconGripVertical,
  IconTrash,
} from "@tabler/icons-react";
import { SortableTreeItem } from "@/components/SortableTreeItem";
import { useState } from "react";

type ListItemProps = {
  component: Component;
  handlerProps?: any;
} & CardProps;

const ListItem = ({ component, handlerProps, children }: ListItemProps) => {
  const theme = useMantineTheme();
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );
  const setSelectedComponentId = useEditorStore(
    (state) => state.setSelectedComponentId
  );
  const setEditorTree = useEditorStore((state) => state.setTree);
  const clearSelection = useEditorStore((state) => state.clearSelection);
  const [opened, { toggle }] = useDisclosure(false);

  const handleSelection = (e: React.MouseEvent<HTMLElement>, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (id !== "root") {
      setSelectedComponentId(id as string);
    }
  };

  return (
    <>
      <Card
        withBorder
        radius="xs"
        p="xs"
        w="100%"
        style={{
          cursor: "pointer",
          borderColor:
            selectedComponentId === component.id
              ? theme.colors.teal[6]
              : undefined,
        }}
        onClick={(e) => handleSelection(e, component.id as string)}
      >
        <Group position="apart" noWrap>
          <Group spacing={4} noWrap>
            {component.id !== "root" && (
              <UnstyledButton
                sx={{ cursor: "grab", alignItems: "center", display: "flex" }}
                {...handlerProps}
              >
                <IconGripVertical size={ICON_SIZE} strokeWidth={1.5} />
              </UnstyledButton>
            )}
            {(component.children ?? [])?.length > 0 && (
              <ActionIcon
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggle();
                }}
              >
                <IconChevronDown
                  size={ICON_SIZE}
                  style={{
                    transition: "transform 200ms ease",
                    transform: opened ? `rotate(-180deg)` : "none",
                  }}
                />
              </ActionIcon>
            )}
            <Text size="xs" lineClamp={1} sx={{ cursor: "pointer" }}>
              {component.id === "root" ? "Root" : component.name}
            </Text>
          </Group>

          {component.id !== "root" && (
            <ActionIcon
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const copy = { ...editorTree };

                if (component.id === selectedComponentId) {
                  clearSelection();
                }

                removeComponent(editorTree.root, component.id as string);
                setEditorTree(copy);
              }}
            >
              <IconTrash size={ICON_SIZE} strokeWidth={1.5} />
            </ActionIcon>
          )}
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
          handlerProps={{ ...attributes, ...listeners }}
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

    if (!dropTarget || dropTarget.id === active.id) {
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
