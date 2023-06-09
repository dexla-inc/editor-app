import { Droppable } from "@/components/Droppable";
import { DroppableDraggable } from "@/components/DroppableDraggable";
import { useEditorStore } from "@/stores/editor";
import { componentMapper, structureMapper } from "@/utils/componentMapper";
import { HEADER_HEIGHT, NAVBAR_WIDTH } from "@/utils/config";
import {
  Component,
  Row,
  addComponent,
  closestEdge,
  getComponentById,
  getComponentParent,
  getEditorTreeFromPageStructure,
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
} from "@dnd-kit/core";
import {
  Aside,
  Box,
  Global,
  Loader,
  Navbar,
  Paper,
  ScrollArea,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { Shell } from "@/components/AppShell";
import { EditorAsideSections } from "@/components/EditorAsideSections";
import { EditorNavbarSections } from "@/components/navbar/EditorNavbarSections";
import { getPage, getPageStream } from "@/requests/projects/queries";
import { decodeSchema } from "@/utils/compression";
import TOML from "@iarna/toml";
import { useAppStore } from "@/stores/app";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import { CustomComponentModal } from "./CustomComponentModal";

type Props = {
  projectId: string;
  pageId: string;
};

export const Editor = ({ projectId, pageId }: Props) => {
  const theme = useMantineTheme();
  const dropTarget = useEditorStore((state) => state.dropTarget);
  const setDropTarget = useEditorStore((state) => state.setDropTarget);
  const clearDropTarget = useEditorStore((state) => state.clearDropTarget);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );
  const setSelectedComponentId = useEditorStore(
    (state) => state.setSelectedComponentId
  );
  const clearSelection = useEditorStore((state) => state.clearSelection);
  const editorTree = useEditorStore((state) => state.tree);
  const setEditorTree = useEditorStore((state) => state.setTree);
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const isLoading = useAppStore((state) => state.isLoading);
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const isStreaming = useRef<boolean>(false);
  const [stream, setStream] = useState<string>("");
  const [componentToAdd, setComponentToAdd] = useState<string>("");
  const [canvasRef] = useAutoAnimate();
  const [isCustomComponentModalOpen, customComponentModal] =
    useDisclosure(false);

  useHotkeys([
    [
      "backspace",
      () => {
        if (selectedComponentId && selectedComponentId !== "root") {
          const copy = { ...editorTree };
          removeComponent(copy.root, selectedComponentId as string);
          setEditorTree(copy);
        }
      },
    ],
  ]);

  useEffect(() => {
    const getPageData = async () => {
      setIsLoading(true);
      const page = await getPage(projectId, pageId);
      if (page.pageState) {
        const decodedSchema = decodeSchema(page.pageState);
        setEditorTree(JSON.parse(decodedSchema));
        setIsLoading(false);
      } else {
        startLoading({
          id: "page-generation",
          title: "Generating Page",
          message: "AI is generating your page",
        });

        const data = await getPageStream(projectId, page.title);

        if (!data) {
          return;
        }

        const reader = data.getReader();
        const decoder = new TextDecoder();
        let done = false;

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          const chunkValue = decoder.decode(value);
          setStream((state) => {
            try {
              return `${state}${chunkValue}`;
            } catch (error) {
              return state;
            }
          });
        }

        stopLoading({
          id: "page-generation",
          title: "Page Generated",
          message: "Here's your page. We hope you like it",
        });
      }
    };

    if (projectId && pageId && !isStreaming.current) {
      (isStreaming as any).current = true;
      getPageData();
    }
  }, [
    projectId,
    pageId,
    setEditorTree,
    startLoading,
    stopLoading,
    setIsLoading,
  ]);

  useEffect(() => {
    if (stream) {
      try {
        const json = TOML.parse(stream);
        const tree = getEditorTreeFromPageStructure(json as { rows: Row[] });
        setEditorTree(tree);
      } catch (error) {
        // Do nothing as we expect the stream to not be parsable every time since it can just be halfway through
        // console.log({ error });
      }
    }
  }, [setEditorTree, stream]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active } = event;

    if (!dropTarget || dropTarget.id === active.id) {
      clearDropTarget();
      return;
    }

    const copy = { ...editorTree };
    const activeComponent = getComponentById(copy.root, active.id as string);

    if (!activeComponent && (active.data.current as any).id) {
      addComponent(
        copy.root,
        active.data.current as unknown as Component,
        dropTarget
      );
      setSelectedComponentId((active.data.current as any).id as string);
    } else if (dropTarget?.id !== "root") {
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
    setComponentToAdd("");
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
    const active = getComponentById(editorTree.root, id as string);
    if (!active) {
      setComponentToAdd(id as string);
    } else {
      setComponentToAdd("");
    }
  };

  const handleDragCancel = () => {
    clearDropTarget();
    clearSelection();
    setComponentToAdd("");
  };

  const renderTree = (component: Component) => {
    if (component.id === "root") {
      return (
        <Paper shadow="xs" ref={canvasRef}>
          <Droppable id={component.id} bg="white" m={0}>
            {component.children?.map((child) => renderTree(child))}
          </Droppable>
        </Paper>
      );
    }

    const componentToRender = componentMapper[component.name];

    if (!componentToRender) {
      return (
        <DroppableDraggable
          id={component.id!}
          component={component}
          customComponentModal={customComponentModal}
        >
          {component.children?.map((child) => renderTree(child))}
        </DroppableDraggable>
      );
    }

    return (
      <DroppableDraggable
        id={component.id!}
        component={component}
        customComponentModal={customComponentModal}
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
      <Shell
        pos="relative"
        navbar={
          <Navbar
            width={{ base: NAVBAR_WIDTH }}
            sx={{
              height: `calc(100% - ${HEADER_HEIGHT}px)`,
            }}
          >
            <Navbar.Section grow component={ScrollArea}>
              <Box py="sm">
                <EditorNavbarSections />
              </Box>
            </Navbar.Section>
          </Navbar>
        }
        aside={
          <Aside
            width={{ base: NAVBAR_WIDTH }}
            sx={{
              height: `calc(100% - ${HEADER_HEIGHT}px)`,
            }}
          >
            <Aside.Section grow component={ScrollArea}>
              <Box py="sm">
                <EditorAsideSections />
              </Box>
            </Aside.Section>
          </Aside>
        }
      >
        <Global
          styles={{
            body: {
              background: theme.colors.gray[0],
              backgroundImage: `radial-gradient(${theme.colors.gray[4]} 1px, transparent 1px), radial-gradient( ${theme.colors.gray[4]} 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0, 50px 50px",
            },
          }}
        />
        <Box
          pos="relative"
          onClick={clearSelection}
          h={`calc(var(--vh, 100vh) - ${HEADER_HEIGHT}px)`}
          p={40}
        >
          {isLoading && !stream && editorTree.root.children?.length === 0 && (
            <Paper
              shadow="xs"
              bg="white"
              sx={{
                width: "100%",
                minHeight: "400px",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
              }}
            >
              <Stack align="center">
                <Text color="teal.6" size="sm" weight="bold">
                  Loading the page
                </Text>
                <Loader />
              </Stack>
            </Paper>
          )}
          {renderTree(editorTree.root)}
        </Box>
        <CustomComponentModal
          customComponentModal={customComponentModal}
          isCustomComponentModalOpen={isCustomComponentModalOpen}
        />
      </Shell>
      <DragOverlay>
        {componentToAdd && structureMapper[componentToAdd]?.Draggable()}
      </DragOverlay>
    </DndContext>
  );
};
