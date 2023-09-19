// The comment below force next to refresh the editor state every time we change something in the code
// @refresh reset
import { Droppable } from "@/components/Droppable";
import { DroppableDraggable } from "@/components/DroppableDraggable";
import { IFrame } from "@/components/IFrame";
import { postPageEventSource } from "@/requests/ai/queries";
import { getPage } from "@/requests/pages/queries";
import { useAppStore } from "@/stores/app";
import { useEditorStore } from "@/stores/editor";
import { componentMapper } from "@/utils/componentMapper";
import { decodeSchema } from "@/utils/compression";
import { Component, getEditorTreeFromTemplateData } from "@/utils/editor";
import TOML from "@iarna/toml";
import { Box, Paper, useMantineTheme } from "@mantine/core";
import { EventSourceMessage } from "@microsoft/fetch-event-source";
import { useEffect, useRef, useState } from "react";

type Props = {
  projectId: string;
  pageId: string;
};

export const Live = ({ projectId, pageId }: Props) => {
  const theme = useMantineTheme();
  const editorTree = useEditorStore((state) => state.tree);
  const setEditorTree = useEditorStore((state) => state.setTree);
  const editorTheme = useEditorStore((state) => state.theme);
  const pages = useEditorStore((state) => state.pages);
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const isStreaming = useRef<boolean>(false);
  const [stream, setStream] = useState<string>();

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
          key={`${component.id}-preview`}
          id={component.id}
          m={0}
          p={0}
          w="100%"
        >
          <Paper shadow="xs" bg="gray.0" display="flex" w="100%">
            {component.children?.map((child) => renderTree(child))}
          </Paper>
        </Droppable>
      );
    }

    const componentToRender = componentMapper[component.name];

    if (!componentToRender) {
      return (
        <DroppableDraggable
          key={`${component.id}-${component?.props?.key}-preview`}
          id={component.id!}
          component={component}
        >
          {component.children?.map((child) => renderTree(child))}
        </DroppableDraggable>
      );
    }

    return (
      <DroppableDraggable
        key={`${component.id}-${component?.props?.key}-preview`}
        id={component.id!}
        component={component}
      >
        {componentToRender?.Component({ component, renderTree })}
      </DroppableDraggable>
    );
  };

  return (editorTree?.root?.children ?? [])?.length > 0 ? (
    <Box
      pos="relative"
      style={{
        minHeight: `100vh`,
      }}
      p={0}
    >
      <IFrame isLive>{renderTree(editorTree.root)}</IFrame>
    </Box>
  ) : null;
};
