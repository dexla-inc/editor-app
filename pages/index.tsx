import { Droppable } from "@/components/Droppable";
import { DroppableDraggable } from "@/components/DroppableDraggable";
import {
  Component,
  DropTarget,
  EditorTree,
  addComponent,
  closestEdge,
  findComponentById,
  getEditorTreeFromInitialPageStructure,
  removeComponent,
} from "@/utils/editor";
import { DndContext, DragEndEvent, DragMoveEvent } from "@dnd-kit/core";
import { Box, Container, Grid } from "@mantine/core";
import { useState } from "react";

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

export default function Home() {
  const editorTree = getEditorTreeFromInitialPageStructure(tree);
  const [treeState, setTreeState] = useState<EditorTree>(editorTree);
  const [dropTarget, setDropTarget] = useState<DropTarget | null>();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active } = event;

    if (
      !dropTarget ||
      dropTarget.id === "root" ||
      dropTarget.id === active.id
    ) {
      return;
    }

    const copy = { ...treeState };
    const toAdd = findComponentById(copy.root, active.id as string);
    removeComponent(copy.root, active.id as string);
    addComponent(copy.root, toAdd as Component, dropTarget);

    setTreeState(copy);
    setDropTarget(null);
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const id = event.collisions?.[0]?.id;
    const edge = event.collisions?.[0]?.data?.edge;
    const target = {
      id: id as string,
      edge,
    };
    setDropTarget(target);
  };

  const renderTree = (component: Component) => {
    if (component.id === "root") {
      return (
        <Droppable
          key={component.id}
          id={component.id}
          grow
          columns={12}
          bg="gray.1"
          m={0}
          gutter={0}
        >
          {component.children?.map(renderTree)}
        </Droppable>
      );
    }

    if (component.name === "Container") {
      return (
        <Grid.Col key={component.id!} span={component.columns}>
          <DroppableDraggable
            id={component.id!}
            grow
            columns={12}
            bg="gray.1"
            m={0}
            gutter={0}
          >
            {component.children?.map(renderTree)}
          </DroppableDraggable>
        </Grid.Col>
      );
    }

    return (
      <Grid.Col key={component.id!} span={component.columns}>
        <Box
          bg="gray.3"
          mih={150}
          sx={{ textAlign: "center", border: "1px solid blue" }}
        >
          {component.name}
        </Box>
      </Grid.Col>
    );
  };

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      collisionDetection={closestEdge}
      onDragMove={handleDragMove}
    >
      <Container my="xl">{renderTree(treeState.root)}</Container>
    </DndContext>
  );
}
