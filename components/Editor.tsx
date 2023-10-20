// The comment below force next to refresh the editor state every time we change something in the code
// @refresh reset
import { Shell } from "@/components/AppShell";
import { CustomComponentModal } from "@/components/CustomComponentModal";
import { Droppable } from "@/components/Droppable";
import { DroppableDraggable } from "@/components/DroppableDraggable";
import { IFrame } from "@/components/IFrame";
import { EditorAsideSections } from "@/components/aside/EditorAsideSections";
import { EditorNavbarSections } from "@/components/navbar/EditorNavbarSections";
import { useHotkeysOnIframe } from "@/hooks/useHotkeysOnIframe";
import { postPageEventSource } from "@/requests/ai/queries";
import { getPage } from "@/requests/pages/queries";
import { useAppStore } from "@/stores/app";
import { useEditorStore, useTemporalStore } from "@/stores/editor";
import { componentMapper } from "@/utils/componentMapper";
import { decodeSchema } from "@/utils/compression";
import {
  ASIDE_WIDTH,
  HEADER_HEIGHT,
  NAVBAR_MIN_WIDTH,
  NAVBAR_WIDTH,
} from "@/utils/config";
import {
  Component,
  addComponent,
  getComponentById,
  getComponentParent,
  getEditorTreeFromTemplateData,
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
  const undo = useTemporalStore((state) => state.undo);
  const redo = useTemporalStore((state) => state.redo);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
  );
  const copiedComponent = useEditorStore((state) => state.copiedComponent);
  const setCopiedComponent = useEditorStore(
    (state) => state.setCopiedComponent,
  );
  const clearSelection = useEditorStore((state) => state.clearSelection);
  const editorTree = useEditorStore((state) => state.tree);
  const setEditorTree = useEditorStore((state) => state.setTree);
  const editorTheme = useEditorStore((state) => state.theme);
  const pages = useEditorStore((state) => state.pages);
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);
  const isNavBarVisible = useEditorStore((state) => state.isNavBarVisible);
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const isLoading = useAppStore((state) => state.isLoading);
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const isStreaming = useRef<boolean>(false);
  const [stream, setStream] = useState<string>();
  const [canvasRef] = useAutoAnimate();
  const [isCustomComponentModalOpen, customComponentModal] =
    useDisclosure(false);

  const deleteComponent = useCallback(() => {
    if (
      selectedComponentId &&
      selectedComponentId !== "root" &&
      selectedComponentId !== "content-wrapper" &&
      !isPreviewMode
    ) {
      const copy = cloneDeep(editorTree);
      const component = getComponentById(copy.root, selectedComponentId);
      removeComponent(copy.root, selectedComponentId);
      setEditorTree(copy, { action: `Removed ${component?.name}` });
      clearSelection();
    }
  }, [
    clearSelection,
    editorTree,
    selectedComponentId,
    setEditorTree,
    isPreviewMode,
  ]);

  const copySelectedComponent = useCallback(() => {
    if (!isPreviewMode && selectedComponentId) {
      setCopiedComponent(
        getComponentById(editorTree.root, selectedComponentId!)!,
      );
    }
  }, [editorTree.root, isPreviewMode, selectedComponentId, setCopiedComponent]);

  const cutSelectedComponent = useCallback(() => {
    if (!isPreviewMode && selectedComponentId) {
      copySelectedComponent();
      deleteComponent();
    }
  }, [
    copySelectedComponent,
    deleteComponent,
    isPreviewMode,
    selectedComponentId,
  ]);

  const pasteCopiedComponent = useCallback(() => {
    if (copiedComponent && !isPreviewMode && selectedComponentId) {
      const copy = cloneDeep(editorTree);
      addComponent(copy.root, copiedComponent, {
        id: getComponentParent(copy.root, copiedComponent.id!)!.id as string,
        edge: "right",
      });
      setEditorTree(copy, { action: `Pasted ${copiedComponent.name}` });
    }
  }, [
    copiedComponent,
    editorTree,
    isPreviewMode,
    selectedComponentId,
    setEditorTree,
  ]);

  useHotkeys([
    ["backspace", deleteComponent],
    ["delete", deleteComponent],
    ["mod+C", copySelectedComponent],
    ["mod+V", pasteCopiedComponent],
    ["mod+X", cutSelectedComponent],
    [
      "mod+Z",
      () => {
        if (!isPreviewMode) {
          undo();
        }
      },
    ],
    [
      "mod+shift+Z",
      () => {
        if (!isPreviewMode) {
          redo();
        }
      },
    ],
    [
      "mod+Y",
      () => {
        if (!isPreviewMode) {
          redo();
        }
      },
    ],
  ]);

  const isMac = window.navigator.userAgent.includes("Mac");

  useHotkeysOnIframe([
    [
      isMac ? "backspace" : "delete",
      (e) => {
        // @ts-ignore
        if (e.target.contentEditable !== "true" && !isPreviewMode) {
          deleteComponent();
        }
      },
      { preventDefault: false },
    ],
    ["mod+C", copySelectedComponent, { preventDefault: false }],
    ["mod+X", cutSelectedComponent, { preventDefault: false }],
    [
      "mod+V",
      (e) => {
        // @ts-ignore
        if (e.target.contentEditable !== "true" && !isPreviewMode) {
          pasteCopiedComponent();
        }
      },
      { preventDefault: false },
    ],
    [
      "mod+Z",
      () => {
        if (!isPreviewMode) {
          undo();
        }
      },
    ],
    [
      "mod+shift+Z",
      () => {
        if (!isPreviewMode) {
          redo();
        }
      },
    ],
    [
      "mod+Y",
      () => {
        if (!isPreviewMode) {
          redo();
        }
      },
    ],
  ]);

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

  useEffect(() => {
    const getPageData = async () => {
      setIsLoading(true);
      const page = await getPage(projectId, pageId);
      if (page.pageState) {
        const decodedSchema = decodeSchema(page.pageState);
        setEditorTree(JSON.parse(decodedSchema), {
          onLoad: true,
          action: "Initial State",
        });
        setIsLoading(false);
      } else {
        startLoading({
          id: "page-generation",
          title: "Generating Page",
          message: "AI is generating your page",
        });

        postPageEventSource(
          projectId,
          page.title,
          onMessage,
          onError,
          onOpen,
          onClose,
          "LAYOUT",
        );
      }
    };

    if (projectId && pageId && !isStreaming.current) {
      (isStreaming as any).current = true;
      getPageData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    projectId,
    pageId,
    setEditorTree,
    startLoading,
    stopLoading,
    setIsLoading,
    pages,
    theme,
  ]);

  useEffect(() => {
    if (stream) {
      try {
        if (!stream.endsWith("___DONE___")) {
          const json = TOML.parse(stream);
          const tree = getEditorTreeFromTemplateData(
            json as any,
            editorTheme,
            pages,
          );

          setEditorTree(tree);
        }
      } catch (error) {
        // Do nothing as we expect the stream to not be parsable every time since it can just be halfway through
        // console.log({ error });
      }
    }
  }, [editorTheme, setEditorTree, stream, pages]);

  const renderTree = (component: Component) => {
    if (component.id === "root") {
      return (
        <Droppable
          key={`${component.id}-${isPreviewMode ? "preview" : "editor"}`}
          id={component.id}
          m={0}
          p={2}
        >
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
          key={`${component.id}-${component?.props?.key}-${
            isPreviewMode ? "preview" : "editor"
          }`}
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
        key={`${component.id}-${component?.props?.key}-${
          isPreviewMode ? "preview" : "editor"
        }`}
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
          !isPreviewMode && isNavBarVisible ? (
            <Navbar
              miw={{ base: NAVBAR_MIN_WIDTH }}
              width={{ base: "auto" }}
              maw={{ base: NAVBAR_WIDTH }}
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
              width={{ base: ASIDE_WIDTH }}
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
            ml={NAVBAR_MIN_WIDTH}
            p={"40px 10px"}
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
        {(editorTree?.root?.children ?? [])?.length > 0 && (
          <Box
            pos="relative"
            onClick={clearSelection}
            style={{
              minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
              height: "100%",
              overflow: "hidden",
            }}
            p={0}
          >
            <IFrame onClick={clearSelection} projectId={projectId}>
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
