import { Droppable } from "@/components/Droppable";
import { DroppableDraggable } from "@/components/DroppableDraggable";
import { useEditorStore } from "@/stores/editor";
import { componentMapper, structureMapper } from "@/utils/componentMapper";
import { HEADER_HEIGHT } from "@/utils/config";
import {
  Component,
  addComponent,
  closestEdge,
  getComponentById,
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
import { Container, Paper } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { useEffect } from "react";
import { Shell } from "@/components/AppShell";

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

  const ref = useClickOutside(clearSelection);

  useEffect(() => {
    const fullTree = getEditorTreeFromInitialPageStructure(tree);
    setEditorTree(fullTree);
  }, [setEditorTree]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active } = event;

    if (!dropTarget || dropTarget.id === active.id) {
      clearDropTarget();
      return;
    }

    const copy = { ...editorTree };

    const dropComponent = getComponentById(copy.root, dropTarget.id as string);
    const activeComponent = getComponentById(copy.root, active.id as string);

    if (!activeComponent) {
      const component = structureMapper[active.id];
      const structure = component.structure({});
      addComponent(copy.root, structure as unknown as Component, dropTarget);
      setSelectedComponentId(structure.id as string);
    } else if (dropComponent?.name !== "Container") {
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
          <Droppable key={component.id} id={component.id} bg="gray.0" m={0}>
            {component.children?.map((child) => renderTree(child))}
          </Droppable>
        </Paper>
      );
    }

    const componentToRender = componentMapper[component.name];

    if (!componentToRender) {
      return (
        <DroppableDraggable
          key={component.id!}
          id={component.id!}
          component={component}
        >
          {component.children?.map((child) => renderTree(child))}
        </DroppableDraggable>
      );
    }

    return (
      <DroppableDraggable
        id={component.id!}
        key={component.id!}
        component={component}
      >
        {componentToRender?.Component({ component, renderTree })}
      </DroppableDraggable>
    );
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
      <Shell>
        <Container
          ref={ref}
          mb="xl"
          mt={HEADER_HEIGHT}
          pos="relative"
          size="xl"
        >
          {renderTree(editorTree.root)}
        </Container>
      </Shell>
    </DndContext>
  );
};
