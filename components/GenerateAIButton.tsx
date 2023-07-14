import { getPageEventSource } from "@/requests/pages/queries";
import { StreamTypes } from "@/requests/pages/types";
import { useAppStore } from "@/stores/app";
import { useEditorStore } from "@/stores/editor";
import { ICON_SIZE } from "@/utils/config";
import { EditorTree, Row, getNewComponents } from "@/utils/editor";
import TOML from "@iarna/toml";
import {
  ActionIcon,
  Button,
  Group,
  Modal,
  Radio,
  Stack,
  Textarea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { EventSourceMessage } from "@microsoft/fetch-event-source";
import { IconSparkles } from "@tabler/icons-react";
import { useEffect, useState } from "react";

type GenerateAIButtonProps = {
  projectId: string;
  pageTitle?: string | undefined;
};

type DescriptionPlaceHolderType = {
  description: string;
  placeholder: string;
  replaceText: string;
};

const descriptionPlaceholderMapping: Record<
  StreamTypes,
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
};

export const GenerateAIButton = ({
  projectId,
  pageTitle = "Need to implement",
}: GenerateAIButtonProps) => {
  const [openedAIModal, { open, close }] = useDisclosure(false);
  const [type, setType] = useState<StreamTypes>("LAYOUT");
  const [description, setDescription] = useState("");
  const [descriptionPlaceholder, setDescriptionPlaceholder] =
    useState<DescriptionPlaceHolderType>(descriptionPlaceholderMapping[type]);
  const isLoading = useAppStore((state) => state.isLoading);
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const editorTheme = useEditorStore((state) => state.theme);
  const pages = useEditorStore((state) => state.pages);
  const setEditorTree = useEditorStore((state) => state.setTree);
  const existingTree = useEditorStore((state) => state.tree);

  const [stream, setStream] = useState<string>();

  const handleTypeChange = (value: StreamTypes) => {
    setType(value);
    setDescriptionPlaceholder(descriptionPlaceholderMapping[value]);
  };

  useEffect(() => {
    if (stream) {
      try {
        const json = TOML.parse(stream);

        const newComponents = getNewComponents(
          json as { rows: Row[] },
          editorTheme,
          pages
        );

        const editorTree: EditorTree = {
          ...existingTree,
          ...newComponents,
        };

        setEditorTree(editorTree);
      } catch (error) {
        // Do nothing as we expect the stream to not be parsable every time since it can just be halfway through
        // console.log({ error });
      }
    }
  }, [stream]);

  const generate = () => {
    setIsLoading(true);
    close();
    startLoading({
      id: "page-generation",
      title: `Generating ${descriptionPlaceholderMapping[type].replaceText}`,
      message: `AI is generating your ${descriptionPlaceholderMapping[type].replaceText}`,
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
      setIsLoading(false);
    };

    const onOpen = async (response: Response) => {
      // no need to do anything
    };

    const onClose = async () => {
      stopLoading({
        id: "page-generation",
        title: `${descriptionPlaceholderMapping[type].replaceText} Generated`,
        message: `Here's your ${descriptionPlaceholderMapping[type].replaceText}. We hope you like it`,
      });
      setIsLoading(false);
    };

    getPageEventSource(
      projectId,
      pageTitle,
      onMessage,
      onError,
      onOpen,
      onClose,
      type,
      description
    );
  };

  return (
    <>
      <ActionIcon
        onClick={open}
        variant="filled"
        color="teal"
        size="lg"
        sx={{ borderRadius: "50%" }}
      >
        <IconSparkles size={ICON_SIZE} />
      </ActionIcon>
      <Modal
        size="xl"
        opened={openedAIModal}
        onClose={close}
        title="Generate AI Content"
      >
        <Stack>
          <Radio.Group
            value={type}
            onChange={handleTypeChange}
            label="What do you want to generate?"
            description="Select the type of content you want to generate"
          >
            <Group mt="xs" spacing="xl" py="sm">
              <Radio
                value="LAYOUT"
                label="Layout"
                description="Change the entire page"
              />
              <Radio
                value="COMPONENT"
                label="Component"
                description="Add / change one component"
              />
              <Radio
                value="DESIGN"
                label="Design"
                description="Change theme"
                disabled
              />
              <Radio
                value="DATA"
                label="Data"
                description="Connect components to data"
                disabled
              />
            </Group>
          </Radio.Group>
          <Textarea
            label="Description"
            description={descriptionPlaceholder.description}
            placeholder={descriptionPlaceholder.placeholder}
            required
            value={description}
            onChange={(event) => setDescription(event.currentTarget.value)}
          />
          <Button
            leftIcon={<IconSparkles size={ICON_SIZE} />}
            onClick={generate}
            disabled={description === ""}
            loading={isLoading}
          >
            Generate
          </Button>
        </Stack>
      </Modal>
    </>
  );
};
