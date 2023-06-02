import { Droppable } from "@/components/Droppable";
import { DroppableDraggable } from "@/components/DroppableDraggable";
import { useEditorStore } from "@/stores/editor";
import { componentMapper } from "@/utils/componentMapper";
import {
  Component,
  addComponent,
  closestEdge,
  findComponentById,
  getComponentParent,
  getEditorTreeFromInitialPageStructure,
  moveComponent,
  moveComponentToDifferentParent,
  removeComponent,
  removeComponentFromParent,
} from "@/utils/editor";
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragStartEvent,
  MeasuringStrategy,
} from "@dnd-kit/core";
import { Container, Grid, Paper } from "@mantine/core";
import { useEffect } from "react";

const tree = {
  rows: [
    {
      row: 1,
      components: [
        {
          columns: 12,
          name: "AppBar",
          description: "Top navigation bar for the web page",
        },
      ],
    },
    {
      row: 2,
      components: [
        {
          columns: 12,
          name: "Breadcrumb",
          description:
            "Displays user's current location within the application",
        },
      ],
    },
    {
      row: 3,
      components: [
        {
          columns: 6,
          name: "ProgressCard",
          description: "Shows the patient's progress and goals",
        },
        {
          columns: 6,
          name: "PieChart",
          description: "Visual representation of vital stats distribution",
        },
      ],
    },
    {
      row: 4,
      components: [
        {
          columns: 8,
          name: "LineChart",
          description: "Displays continuous vital stats over time",
        },
        {
          columns: 4,
          name: "TaskList",
          description:
            "List of tasks assigned to the patient or healthcare provider",
        },
      ],
    },
    {
      row: 5,
      components: [
        {
          columns: 8,
          name: "Table",
          description: "Detailed view of patient's vitals",
        },
        {
          columns: 4,
          name: "ProfileList",
          description: "List of related healthcare professionals",
        },
      ],
    },
    {
      row: 6,
      components: [
        {
          columns: 6,
          name: "Carousel",
          description: "Rotating display of educational content",
        },
        {
          columns: 6,
          name: "ImageCardList",
          description: "Visual cards about specific medical devices used",
        },
      ],
    },
  ],
};

export const Editor = () => {
  const dropTarget = useEditorStore((state) => state.dropTarget);
  const setDropTarget = useEditorStore((state) => state.setDropTarget);
  const clearDropTarget = useEditorStore((state) => state.clearDropTarget);
  const setSelectedComponentId = useEditorStore(
    (state) => state.setSelectedComponentId
  );
  const clearSelection = useEditorStore((state) => state.clearSelection);
  const editorTree = useEditorStore((state) => state.tree);
  const setEditorTree = useEditorStore((state) => state.setTree);

  useEffect(() => {
    setEditorTree(getEditorTreeFromInitialPageStructure(tree));
  }, [setEditorTree]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active } = event;

    if (!dropTarget || dropTarget.id === active.id) {
      clearDropTarget();
      clearSelection();
      return;
    }

    const copy = { ...editorTree };

    const activeComponent = findComponentById(
      copy.root,
      dropTarget.id as string
    );

    if (activeComponent?.name !== "Container") {
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
      const toAdd = findComponentById(copy.root, active.id as string);
      removeComponent(copy.root, active.id as string);
      addComponent(copy.root, toAdd as unknown as Component, dropTarget);
    }

    setEditorTree(copy);
    clearDropTarget();
    clearSelection();
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

  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id;
    setSelectedComponentId(id as string);
  };

  const handleDragCancel = () => {
    clearDropTarget();
    clearSelection();
  };

  const renderTree = (component: Component) => {
    if (component.id === "root") {
      return (
        <Paper shadow="xs">
          <Droppable
            key={component.id}
            id={component.id}
            grow
            columns={12}
            bg="gray.0"
            m={0}
            gutter={0}
          >
            {component.children?.map((child) => renderTree(child))}
          </Droppable>
        </Paper>
      );
    }

    if (component.name === "Container") {
      return (
        <DroppableDraggable
          {...component}
          key={component.id!}
          id={component.id!}
          span={component.columns}
        >
          <Grid grow columns={12} m={0} gutter={0}>
            {component.children?.map((child) => renderTree(child))}
          </Grid>
        </DroppableDraggable>
      );
    }

    const componentToRender = componentMapper[component.name];

    return (
      <DroppableDraggable
        id={component.id!}
        key={component.id!}
        span={component.columns}
      >
        {componentToRender.Component(component)}
      </DroppableDraggable>
    );
  };

  return (
    <DndContext
      collisionDetection={(args) => {
        return closestEdge(args, editorTree);
      }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragMove={handleDragMove}
      onDragCancel={handleDragCancel}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
    >
      <Container my="xl" pos="relative">
        {renderTree(editorTree.root)}
      </Container>
    </DndContext>
  );
};
