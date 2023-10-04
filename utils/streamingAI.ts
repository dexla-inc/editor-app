import { getPagesEventSource, postEventSource } from "@/requests/ai/queries";
import { AIRequestTypes, EventSourceParams } from "@/requests/ai/types";
import { DexlaNotificationProps } from "@/stores/app";
import TOML from "@iarna/toml";
import { EventSourceMessage } from "@microsoft/fetch-event-source";
import { Dispatch, SetStateAction } from "react";

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
  PAGE_NAMES: {
    description: "",
    placeholder: "",
    replaceText: "Page names",
  },
  CSS_MODIFIER: {
    description: "",
    placeholder: "",
    replaceText: "CSS modifier",
  },
};

type HandlerProps = {
  setStream: Dispatch<SetStateAction<string>>;
  stopLoading: (state: DexlaNotificationProps) => void;
  setIsLoading: (isLoading: boolean) => void;
};

export const createHandlers = (config: HandlerProps) => {
  const { setStream, stopLoading, setIsLoading } = config;

  const onMessage = (event: EventSourceMessage) => {
    try {
      if (event.data.includes("```toml") || event.data.includes("```TOML")) {
        console.warn("Ignoring data block containing ```toml");
        return;
      }

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
      setStream("");
      stopLoading({
        id: "ai-generation",
        title: "Finished Generating",
        message: "We hope you like it", //`Here's your ${descriptionPlaceholderMapping[type].replaceText}. We hope you like it`,
      });
    } catch (error) {
      stopLoading({
        id: "ai-generation",
        title: "AI Generation Failed", //`${descriptionPlaceholderMapping[type].replaceText} Failed`,
        message: "There was a problem generating.", //`There was a problem generating your ${descriptionPlaceholderMapping[type].replaceText}`,
        isError: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { onMessage, onError, onOpen, onClose };
};

type ProcessTOMLStreamProps<T> = {
  stream: string;
  handler: (toml: T) => void;
};

let tomlBuffer = ""; // Buffer to hold incoming TOML data

export const processTOMLStream = <T>(params: ProcessTOMLStreamProps<T>) => {
  const { stream, handler } = params;

  if (!stream || stream.endsWith("___DONE___")) {
    // Clear the buffer if we're done
    tomlBuffer = "";
    return;
  }

  tomlBuffer += stream;
  console.log("processTOMLStream", tomlBuffer);
  try {
    const json = TOML.parse(tomlBuffer) as unknown as T;
    tomlBuffer = "";
    handler(json);
  } catch (error) {
    // If parsing fails, keep the data in the buffer and wait for more data to come in
    console.error("TOML parsing failed, waiting for more data.", error);
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
    id: "ai-generation",
    title: `Generating ${
      descriptionPlaceholderMapping[params.type].replaceText
    }`,
    message: `AI is generating your ${
      descriptionPlaceholderMapping[params.type].replaceText
    }`,
  });

  await postEventSource(projectId, params, onmessage, onerror, onopen, onclose);
};

// This needs consolidation with handleRequestContentStream in the back end
export const handleRequestGetStream = async (
  projectId: string,
  count: number = 5,
  type: AIRequestTypes,
  startLoading: (state: DexlaNotificationProps) => void,
  onmessage: (ev: EventSourceMessage) => void,
  onerror: (err: any) => number | null | undefined | void,
  onopen: (response: Response) => Promise<void>,
  onclose: () => void,
  excludedCsv?: string,
) => {
  startLoading({
    id: "ai-generation",
    title: `Generating ${descriptionPlaceholderMapping[type].replaceText}`,
    message: `AI is generating your ${descriptionPlaceholderMapping[type].replaceText}`,
  });

  await getPagesEventSource(
    projectId,
    count,
    excludedCsv,
    onmessage,
    onerror,
    onopen,
    onclose,
  );
};
