import { postEventSource } from "@/requests/ai/queries";
import { AIRequestTypes, EventSourceParams } from "@/requests/ai/types";
import { PageResponse } from "@/requests/pages/types";
import { DexlaNotificationProps } from "@/stores/app";
import { MantineThemeExtended } from "@/stores/editor";
import {
  Component,
  EditorTree,
  Row,
  addComponent,
  getComponentBeingAddedId,
  getEditorTreeFromPageStructure,
  getNewComponents,
} from "@/utils/editor";
import TOML from "@iarna/toml";
import { EventSourceMessage } from "@microsoft/fetch-event-source";
import cloneDeep from "lodash.clonedeep";
import { Dispatch, MutableRefObject, SetStateAction } from "react";

type DescriptionPlaceHolderType = {
  description: string;
  placeholder: string;
  replaceText: string;
};

export const descriptionPlaceholderMapping: Record<
  AIRequestTypes,
  DescriptionPlaceHolderType
> = {
  LAYOUT: {
    description: "Describe the layout you want to generate or change",
    placeholder:
      "Delete breadcrumbs, change the title from Dashboard to Metrics Dashboard, move the form to the right and add an image to the left...",
    replaceText: "Page",
  },
  COMPONENT: {
    description: "Describe the component you want to generate or change",
    placeholder:
      "Add a new pie chart outlining the number of users per country...",
    replaceText: "Component",
  },
  DESIGN: {
    description: "Describe the design you want to generate or change",
    placeholder: "Change the color theme to dark mode...",
    replaceText: "Design",
  },
  DATA: {
    description: "Describe the data you want to generate or change",
    placeholder:
      "Connect the table component with the transactions endpoint...",
    replaceText: "Data",
  },
  PAGE: {
    description: "Describe the page you want to generate or change",
    placeholder: "Create a new page with the title 'Account Settings'...",
    replaceText: "Page",
  },
  API: {
    description: "Describe the API you want to generate or change",
    placeholder: "Create a new API endpoint for the user's transactions...",
    replaceText: "API",
  },
};

type HandlerProps = {
  setStream: Dispatch<SetStateAction<string>>;
  type: AIRequestTypes;
  componentBeingAddedId: MutableRefObject<string | undefined>;
  updateTreeComponent: (
    componentId: string,
    props: any,
    save?: boolean,
  ) => void;
  stopLoading: (state: DexlaNotificationProps) => void;
  setIsLoading: (isLoading: boolean) => void;
};

export const createHandlers = (config: HandlerProps) => {
  const {
    setStream,
    type,
    componentBeingAddedId,
    stopLoading,
    setIsLoading,
    updateTreeComponent,
  } = config;

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
          console.error(error);
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
      id: "ai-generation",
      title: "There was a problem",
      message: err,
      isError: true,
    });
    setIsLoading(false);
  };

  const onOpen = async (response: Response) => {
    // no need to do anything
  };

  const onClose = async () => {
    try {
      if (type === "PAGE") {
        setStream("");
        return;
      }

      if (componentBeingAddedId.current) {
        updateTreeComponent(componentBeingAddedId.current, {
          isBeingAdded: false,
        });
      }
      setStream("");
      stopLoading({
        id: "ai-generation",
        title: `${descriptionPlaceholderMapping[type].replaceText} Generated`,
        message: `Here's your ${descriptionPlaceholderMapping[type].replaceText}. We hope you like it`,
      });
    } catch (error) {
      stopLoading({
        id: "ai-generation",
        title: `${descriptionPlaceholderMapping[type].replaceText} Failed`,
        message: `There was a problem generating your ${descriptionPlaceholderMapping[type].replaceText}`,
        isError: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { onMessage, onError, onOpen, onClose };
};

type ProcessTOMLStreamProps = {
  type: AIRequestTypes;
  stream: string;
  componentBeingAddedId: MutableRefObject<string | undefined>;
  theme: MantineThemeExtended;
  updateTreeComponentChildren: (
    componentId: string,
    children: Component[],
  ) => void;
  setTree: (
    tree: EditorTree,
    options?: { onLoad?: boolean; action?: string },
  ) => void;
  pages: PageResponse[];
  tree: EditorTree;
};

export const processTOMLStream = (params: ProcessTOMLStreamProps) => {
  const {
    type,
    stream,
    componentBeingAddedId,
    updateTreeComponentChildren,
    tree: editorTree,
    setTree,
    theme,
    pages,
  } = params;

  if (!stream || stream.endsWith("___DONE___")) return;

  switch (type) {
    case "COMPONENT":
      const componentJson = TOML.parse(stream) as unknown as { rows: Row[] };
      console.log(stream);
      const newComponents = getNewComponents(
        componentJson as { rows: Row[] },
        theme,
        pages,
      );

      const id = getComponentBeingAddedId(editorTree.root);

      if (!id) {
        const copy = cloneDeep(editorTree);

        addComponent(copy.root, newComponents, {
          id: "content-wrapper",
          edge: "bottom",
        });

        setTree(copy, { action: `Added ${newComponents.name}` });
      } else {
        componentBeingAddedId.current = id;
        updateTreeComponentChildren(id, newComponents.children!);
      }
      break;
    case "LAYOUT":
      const layoutJson = TOML.parse(stream) as unknown as { rows: Row[] };

      const tree = getEditorTreeFromPageStructure(
        layoutJson as { rows: Row[] },
        theme,
        pages,
      );

      setTree(tree, { action: `Layout changed` });
      break;
    default:
      console.log(type + " not implemented yet");
      break;
  }
};

export const handleRequestContentStream = async (
  projectId: string,
  params: EventSourceParams,
  startLoading: (state: DexlaNotificationProps) => void,
  onmessage: (ev: EventSourceMessage) => void,
  onerror: (err: any) => number | null | undefined | void,
  onopen: (response: Response) => Promise<void>,
  onclose: () => void,
) => {
  startLoading({
    id: "page-generation",
    title: `Generating ${
      descriptionPlaceholderMapping[params.type].replaceText
    }`,
    message: `AI is generating your ${
      descriptionPlaceholderMapping[params.type].replaceText
    }`,
  });

  await postEventSource(projectId, params, onmessage, onerror, onopen, onclose);
};
