// The comment below force next to refresh the editor state every time we change something in the code
// @refresh reset
import { Shell } from "@/components/AppShell";
import { CustomComponentModal } from "@/components/CustomComponentModal";
import { Droppable } from "@/components/Droppable";
import { DroppableDraggable } from "@/components/DroppableDraggable";
import { IFrame } from "@/components/IFrame";
import { EditorAsideSections } from "@/components/aside/EditorAsideSections";
import { EditorNavbarSections } from "@/components/navbar/EditorNavbarSections";
import { defaultPageState, useGetPageData } from "@/hooks/useGetPageData";
import { useHotkeysOnIframe } from "@/hooks/useHotkeysOnIframe";
import { useAppStore } from "@/stores/app";
import { useEditorStore, useTemporalStore } from "@/stores/editor";
import { useUserConfigStore } from "@/stores/userConfig";
import { componentMapper } from "@/utils/componentMapper";
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
  getComponentIndex,
  getComponentParent,
  removeComponent,
} from "@/utils/editor";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  Aside,
  Box,
  Button,
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
import { useQueryClient } from "@tanstack/react-query";
import cloneDeep from "lodash.clonedeep";
import { useCallback } from "react";

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
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);
  const isNavBarVisible = useEditorStore((state) => state.isNavBarVisible);
  const isLoading = useAppStore((state) => state.isLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const setSelectedComponentId = useEditorStore(
    (state) => state.setSelectedComponentId,
  );
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const isTabPinned = useUserConfigStore((state) => state.isTabPinned);
  const [canvasRef] = useAutoAnimate();
  const [isCustomComponentModalOpen, customComponentModal] =
    useDisclosure(false);

  useGetPageData({ projectId, pageId });

  const queryClient = useQueryClient();

  const cancelGeneratePage = () => {
    stopLoading({
      id: "page-generation",
      title: "Page Cancelled",
      message: "You can build from scratch",
      isError: true,
    });
    queryClient.cancelQueries({ queryKey: ["page"] });
    setEditorTree(defaultPageState, {
      onLoad: true,
      action: "Initial State",
    });
    setIsLoading(false);
  };

  const deleteComponent = useCallback(() => {
    if (
      selectedComponentId &&
      selectedComponentId !== "root" &&
      selectedComponentId !== "content-wrapper" &&
      !isPreviewMode
    ) {
      const copy = cloneDeep(editorTree);

      const parent = getComponentParent(editorTree.root, selectedComponentId);
      const component = getComponentById(copy.root, selectedComponentId);
      removeComponent(copy.root, selectedComponentId);
      setEditorTree(copy, { action: `Removed ${component?.name}` });
      clearSelection(parent?.id);
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

  const determinePasteTarget = (selectedId: string | undefined) => {
    if (!selectedId) return "content-wrapper";
    if (selectedId === "root") return "content-wrapper";
    return selectedId as string;
  };

  const pasteCopiedComponent = useCallback(async () => {
    if (!copiedComponent || isPreviewMode) {
      return; // Early exit if conditions aren't met
    }

    const copy = cloneDeep(editorTree);
    const targetId = determinePasteTarget(selectedComponentId);
    const parentComponent = getComponentParent(copy.root, targetId);

    const newSelectedId = addComponent(
      copy.root,
      copiedComponent,
      {
        id: parentComponent!.id as string,
        edge: "right",
      },
      getComponentIndex(parentComponent!, selectedComponentId!) + 1,
    );

    await setEditorTree(copy, { action: `Pasted ${copiedComponent.name}` });
    setSelectedComponentId(newSelectedId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              width={{ base: NAVBAR_MIN_WIDTH }}
              maw={{ base: NAVBAR_WIDTH }}
              sx={{
                height: `calc(100% - ${HEADER_HEIGHT}px)`,
              }}
            >
              <Navbar.Section grow component={ScrollArea} py="sm">
                <EditorNavbarSections />
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
        {isLoading && editorTree.root.children?.length === 0 && (
          <Box
            pos="relative"
            onClick={() => clearSelection()}
            style={{ minHeight: `calc(100vh - ${HEADER_HEIGHT}px)` }}
            ml={isTabPinned ? NAVBAR_WIDTH : NAVBAR_MIN_WIDTH - 50} // Weird sizing issue that I haven't got time to investigate, had to hack it
            p={"40px 10px"}
          >
            <Paper
              pos="relative"
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

              <Button
                color="red"
                pos="absolute"
                bottom={30}
                type="button"
                onClick={cancelGeneratePage}
              >
                Cancel
              </Button>
            </Paper>
          </Box>
        )}
        {(editorTree?.root?.children ?? [])?.length > 0 && (
          <Box
            pos="relative"
            onClick={() => clearSelection()}
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
