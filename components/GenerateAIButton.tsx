import { postPageEventSource } from "@/requests/ai/queries";
import { StreamTypes } from "@/requests/ai/types";
import { useAppStore } from "@/stores/app";
import { useEditorStore } from "@/stores/editor";
import { ICON_SIZE } from "@/utils/config";
import {
  Row,
  addComponent,
  getComponentBeingAddedId,
  getEditorTreeFromPageStructure,
  getNewComponents,
} from "@/utils/editor";
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
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { EventSourceMessage } from "@microsoft/fetch-event-source";
import { IconSparkles } from "@tabler/icons-react";
import cloneDeep from "lodash.clonedeep";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

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

export const GenerateAIButton = ({ projectId }: GenerateAIButtonProps) => {
  const [openedAIModal, { open, close }] = useDisclosure(false);
  const [type, setType] = useState<StreamTypes>("COMPONENT");
  const [description, setDescription] = useState("");
  const [descriptionPlaceholder, setDescriptionPlaceholder] =
    useState<DescriptionPlaceHolderType>(descriptionPlaceholderMapping[type]);
  const isLoading = useAppStore((state) => state.isLoading);
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const editorTheme = useEditorStore((state) => state.theme);
  const pages = useEditorStore((state) => state.pages);
  const router = useRouter();
  const currentPageId = router.query.page as string;
  const pageTitle = pages?.find((p) => p.id === currentPageId)?.title;

  const setEditorTree = useEditorStore((state) => state.setTree);
  const updateTreeComponent = useEditorStore(
    (state) => state.updateTreeComponent
  );
  const updateTreeComponentChildren = useEditorStore(
    (state) => state.updateTreeComponentChildren
  );
  const existingTree = useEditorStore((state) => state.tree);
  const componentBeignAddedId = useRef<string>();

  const [stream, setStream] = useState<string>();

  const handleTypeChange = (value: StreamTypes) => {
    setType(value);
    setDescriptionPlaceholder(descriptionPlaceholderMapping[value]);
  };

  const closeModal = () => {
    close();
    setDescription("");
    setType("COMPONENT");
  };

  const form = useForm({
    initialValues: {
      type: "COMPONENT",
      description: "",
    },
  });

  useEffect(() => {
    if (type === "COMPONENT") {
      if (stream) {
        try {
          const json = TOML.parse(stream);

          const newComponents = getNewComponents(
            json as { rows: Row[] },
            editorTheme,
            pages
          );

          const id = getComponentBeingAddedId(existingTree.root);

          if (!id) {
            const copy = cloneDeep(existingTree);

            addComponent(copy.root, newComponents, {
              id: "content-wrapper",
              edge: "bottom",
            });

            setEditorTree(copy);
          } else {
            componentBeignAddedId.current = id;
            updateTreeComponentChildren(id, newComponents.children!);
          }
        } catch (error) {
          // Do nothing as we expect the stream to not be parsable every time since it can just be halfway through
          // console.log({ error });
        }
      }
    } else if (type === "LAYOUT") {
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    editorTheme,
    pages,
    setEditorTree,
    stream,
    type,
    updateTreeComponentChildren,
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
      // console.error(error);
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
    try {
      if (type === "PAGE") {
        setStream("");
        return;
      }

      if (componentBeignAddedId.current) {
        updateTreeComponent(componentBeignAddedId.current, {
          isBeingAdded: false,
        });
      }
      setStream("");
      stopLoading({
        id: "page-generation",
        title: `${descriptionPlaceholderMapping[type].replaceText} Generated`,
        message: `Here's your ${descriptionPlaceholderMapping[type].replaceText}. We hope you like it`,
      });
    } catch (error) {
      stopLoading({
        id: "page-generation",
        title: `${descriptionPlaceholderMapping[type].replaceText} Failed`,
        message: `There was a problem generating your ${descriptionPlaceholderMapping[type].replaceText}`,
        isError: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: any) => {
    setIsLoading(true);
    closeModal();
    startLoading({
      id: "page-generation",
      title: `Generating ${descriptionPlaceholderMapping[type].replaceText}`,
      message: `AI is generating your ${descriptionPlaceholderMapping[type].replaceText}`,
    });

    postPageEventSource(
      projectId,
      pageTitle ?? "",
      onMessage,
      onError,
      onOpen,
      onClose,
      values.type,
      values.description
    );
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Check if Enter key was pressed without Shift key
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();

      onSubmit(form.values);
    }
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
        onClose={closeModal}
        title="Generate AI Content"
      >
        <form onSubmit={form.onSubmit(onSubmit)}>
          <Stack>
            <Radio.Group
              value={type}
              onChange={(value) => {
                form.setFieldValue("type", value as StreamTypes);
                handleTypeChange(value as StreamTypes);
              }}
              label="What do you want to generate?"
              description="Select the type of content you want to generate"
            >
              <Group mt="xs" spacing="xl" py="sm">
                <Radio
                  value="COMPONENT"
                  label="Component"
                  description="Add / change one component"
                />
                <Radio
                  value="LAYOUT"
                  label="Layout"
                  description="Change the entire page"
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
              onChange={(event) => {
                form.setFieldValue(
                  "description",
                  event.currentTarget.value as string
                );
                setDescription(event.currentTarget.value);
              }}
              autosize
              onKeyDown={handleKeyDown}
            />
            <Button
              leftIcon={<IconSparkles size={ICON_SIZE} />}
              type="submit"
              disabled={isLoading}
              loading={isLoading}
            >
              Generate
            </Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
};
