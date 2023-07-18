import { Shell } from "@/components/AppShell";
import { CustomComponentModal } from "@/components/CustomComponentModal";
import { Droppable } from "@/components/Droppable";
import { DroppableDraggable } from "@/components/DroppableDraggable";
import { EditorAsideSections } from "@/components/EditorAsideSections";
import { IFrame } from "@/components/IFrame";
import { EditorNavbarSections } from "@/components/navbar/EditorNavbarSections";
import { useHotkeysOnIframe } from "@/hooks/useHotkeysOnIframe";
import { postPageEventSource } from "@/requests/ai/queries";
import { getPage } from "@/requests/pages/queries";
import { useAppStore } from "@/stores/app";
import { useEditorStore, useTemporalStore } from "@/stores/editor";
import { componentMapper } from "@/utils/componentMapper";
import { decodeSchema } from "@/utils/compression";
import { HEADER_HEIGHT, NAVBAR_WIDTH } from "@/utils/config";
import {
  Component,
  Row,
  addComponent,
  getComponentById,
  getComponentParent,
  getEditorTreeFromPageStructure,
  removeComponent,
} from "@/utils/editor";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import TOML from "@iarna/toml";
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
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import { EventSourceMessage } from "@microsoft/fetch-event-source";
import cloneDeep from "lodash.clonedeep";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  projectId: string;
  pageId: string;
};

export const Editor = ({ projectId, pageId }: Props) => {
  const theme = useMantineTheme();
  const { undo, redo } = useTemporalStore((state) => state);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );
  const clearSelection = useEditorStore((state) => state.clearSelection);
  const editorTree = useEditorStore((state) => state.tree);
  const setEditorTree = useEditorStore((state) => state.setTree);
  const editorTheme = useEditorStore((state) => state.theme);
  const pages = useEditorStore((state) => state.pages);
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const isLoading = useAppStore((state) => state.isLoading);
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const isStreaming = useRef<boolean>(false);
  const [stream, setStream] = useState<string>();
  const [copiedComponentId, setCopiedComponentId] = useState<string>();
  const [canvasRef] = useAutoAnimate();
  const [isCustomComponentModalOpen, customComponentModal] =
    useDisclosure(false);

  const deleteComponent = useCallback(() => {
    if (
      selectedComponentId &&
      selectedComponentId !== "root" &&
      selectedComponentId !== "content-wrapper"
    ) {
      const copy = cloneDeep(editorTree);
      removeComponent(copy.root, selectedComponentId as string);
      setEditorTree(copy);
      clearSelection();
    }
  }, [clearSelection, editorTree, selectedComponentId, setEditorTree]);

  const copySelectedCompnent = useCallback(() => {
    setCopiedComponentId(selectedComponentId);
  }, [setCopiedComponentId, selectedComponentId]);

  const pasteCopiedComponent = useCallback(() => {
    if (copiedComponentId) {
      const isSelectedId = selectedComponentId === copiedComponentId;
      const copy = cloneDeep(editorTree);
      addComponent(copy.root, getComponentById(copy.root, copiedComponentId)!, {
        id: isSelectedId
          ? (getComponentParent(copy.root, copiedComponentId)!.id as string)
          : (getComponentById(copy.root, selectedComponentId as string)!
              .id as string),
        edge: "right",
      });
      setEditorTree(copy);
    }
  }, [copiedComponentId, editorTree, selectedComponentId, setEditorTree]);

  useHotkeys([
    ["backspace", deleteComponent],
    ["delete", deleteComponent],
    ["mod+C", copySelectedCompnent],
    ["mod+V", pasteCopiedComponent],
    ["mod+Z", () => undo()],
    ["mod+shift+Z", () => redo()],
    ["mod+Y", () => redo()],
  ]);

  useHotkeysOnIframe([
    [
      "backspace",
      (e) => {
        // @ts-ignore
        if (e.target.contentEditable !== "true") {
          deleteComponent();
        }
      },
      { preventDefault: false },
    ],
    [
      "delete",
      (e) => {
        // @ts-ignore
        if (e.target.contentEditable !== "true") {
          deleteComponent();
        }
      },
      { preventDefault: false },
    ],
    ["mod+C", copySelectedCompnent, { preventDefault: false }],
    [
      "mod+V",
      (e) => {
        // @ts-ignore
        if (e.target.contentEditable !== "true") {
          pasteCopiedComponent();
        }
      },
      { preventDefault: false },
    ],
    ["mod+Z", () => undo()],
    ["mod+shift+Z", () => redo()],
    ["mod+Y", () => redo()],
  ]);

  useEffect(() => {
    const getPageData = async () => {
      setIsLoading(true);
      const page = await getPage(projectId, pageId);
      if (page.pageState) {
        const decodedSchema = decodeSchema(page.pageState);
        setEditorTree(JSON.parse(decodedSchema), true);
        setIsLoading(false);
      } else {
        startLoading({
          id: "page-generation",
          title: "Generating Page",
          message: "AI is generating your page",
        });

        const onMessage = (event: EventSourceMessage) => {
          try {
            setStream((state) => {
              try {
                if (state === undefined) {
                  return event.data;
                } else {
                  return `${state}
                  ${event.data}`;
                }
              } catch (error) {
                return state;
              }
            });
          } catch (error) {
            // Do nothing as we expect the stream to not be parsable every time since it can just be halfway through
            console.error(error);
          }
        };

        const onError = (err: any) => {
          stopLoading({
            id: "page-generation",
            title: "There was a problem",
            message: err,
            isError: true,
          });
        };

        const onOpen = async (response: Response) => {
          // handle open
        };

        const onClose = async () => {
          stopLoading({
            id: "page-generation",
            title: "Page Generated",
            message: "Here's your page. We hope you like it",
          });
        };

        postPageEventSource(
          projectId,
          page.title,
          onMessage,
          onError,
          onOpen,
          onClose,
          "LAYOUT"
        );
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
        const tree = getEditorTreeFromPageStructure(
          json as { rows: Row[] },
          editorTheme,
          pages
        );

        setEditorTree(tree);
      } catch (error) {
        // Do nothing as we expect the stream to not be parsable every time since it can just be halfway through
        // console.log({ error });
      }
    }
  }, [editorTheme, setEditorTree, stream, pages]);

  const renderTree = (component: Component) => {
    if (component.id === "root") {
      return (
        <Droppable key={component.id} id={component.id} m={0} p={2}>
          <Paper shadow="xs" ref={canvasRef} bg="gray.0" display="flex">
            {component.children?.map((child) => renderTree(child))}
          </Paper>
        </Droppable>
      );
    }

    const componentToRender = componentMapper[component.name];

    if (!componentToRender) {
      return (
        <DroppableDraggable
          key={component.id}
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
        key={component.id}
        id={component.id!}
        component={component}
        customComponentModal={customComponentModal}
      >
        {componentToRender?.Component({ component, renderTree })}
      </DroppableDraggable>
    );
  };

  return (
    <>
      <Shell
        pos="relative"
        navbar={
          !isPreviewMode ? (
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
          ) : undefined
        }
        aside={
          !isPreviewMode ? (
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
          ) : undefined
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
        {isLoading && !stream && editorTree.root.children?.length === 0 && (
          <Box
            pos="relative"
            onClick={clearSelection}
            style={{ minHeight: `calc(100vh - ${HEADER_HEIGHT}px)` }}
            p={40}
          >
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
          </Box>
        )}
        {(editorTree.root.children ?? [])?.length > 0 && (
          <Box
            pos="relative"
            onClick={clearSelection}
            style={{
              minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
              overflow: "visible",
            }}
            p={0}
          >
            <IFrame onClick={clearSelection}>
              {renderTree(editorTree.root)}
            </IFrame>
          </Box>
        )}
        <CustomComponentModal
          customComponentModal={customComponentModal}
          isCustomComponentModalOpen={isCustomComponentModalOpen}
        />
      </Shell>
    </>
  );
};
