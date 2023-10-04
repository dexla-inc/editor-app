import { Icon } from "@/components/Icon";
import { AITextArea } from "@/components/ai/AITextArea";
import { AIRequestTypes } from "@/requests/ai/types";
import { PageResponse } from "@/requests/pages/types";
import { useAppStore } from "@/stores/app";
import { MantineThemeExtended, useEditorStore } from "@/stores/editor";
import { ICON_SIZE } from "@/utils/config";
import {
  Component,
  EditorTree,
  addComponent,
  debouncedTreeComponentStyleUpdate,
  getComponentBeingAddedId,
  getEditorTreeFromPageStructure,
  getNewComponents,
} from "@/utils/editor";
import {
  createHandlers,
  descriptionPlaceholderMapping,
  handleRequestContentStream,
  processTOMLStream,
} from "@/utils/streamingAI";
import {
  ActionIcon,
  Badge,
  Button,
  Flex,
  Modal,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconSparkles } from "@tabler/icons-react";
import cloneDeep from "lodash.clonedeep";
import { useRouter } from "next/router";
import { MutableRefObject, useEffect, useRef, useState } from "react";

type ComponentGenerationProps = {
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

type LayoutGenerationProps = {
  theme: MantineThemeExtended;
  pages: PageResponse[];
  tree: EditorTree;
  setTree: (
    tree: EditorTree,
    options?: { onLoad?: boolean; action?: string },
  ) => void;
};

type GenerateAIButtonProps = {
  projectId: string;
  pageTitle?: string | undefined;
};

type CssModiferAIResponse = {
  css: Record<string, string | number>;
};

type CssModifer = {
  modifiers: Record<string, string | number>;
  selectedComponentId: string;
};

export const GenerateAIButton = ({ projectId }: GenerateAIButtonProps) => {
  const [openedAIModal, { open, close }] = useDisclosure(false);
  const [type, setType] = useState<AIRequestTypes>("CSS_MODIFIER");
  const [description, setDescription] = useState("");
  const isLoading = useAppStore((state) => state.isLoading);
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const startLoading = useAppStore((state) => state.startLoading);
  const pages = useEditorStore((state) => state.pages);
  const router = useRouter();
  const currentPageId = router.query.page as string;
  const pageTitle = pages?.find((p) => p.id === currentPageId)?.title;
  const componentBeingAddedId = useRef<string>();
  const setTree = useEditorStore((state) => state.setTree);
  const updateTreeComponent = useEditorStore(
    (state) => state.updateTreeComponent,
  );
  const updateTreeComponentChildren = useEditorStore(
    (state) => state.updateTreeComponentChildren,
  );
  const tree = useEditorStore((state) => state.tree);
  const theme = useEditorStore((state) => state.theme);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
  );
  const [stream, setStream] = useState<string>("");
  const [modifier, setModifier] = useState<CssModifer>();

  const { onMessage, onError, onOpen, onClose } = createHandlers({
    setStream,
    setIsLoading,
    stopLoading,
  });

  const handleComponentGeneration = (params: ComponentGenerationProps) => {
    return function (tomlData: any) {
      const {
        componentBeingAddedId,
        theme,
        updateTreeComponentChildren,
        setTree,
        pages,
        tree,
      } = params;

      const newComponents = getNewComponents(tomlData, theme, pages);

      const id = getComponentBeingAddedId(tree.root);

      if (!id) {
        const copy = cloneDeep(tree);
        addComponent(copy.root, newComponents, {
          id: "content-wrapper",
          edge: "bottom",
        });
        setTree(copy, { action: `Added ${newComponents.name}` });
      } else {
        componentBeingAddedId.current = id;
        updateTreeComponentChildren(id, newComponents.children!);
      }
    };
  };

  const handleLayoutGeneration = (params: LayoutGenerationProps) => {
    return function (tomlData: any) {
      const { theme, pages, setTree } = params;

      const tree = getEditorTreeFromPageStructure(tomlData, theme, pages);

      setTree(tree, { action: `Layout changed` });
    };
  };

  const handleCssGeneration = () => {
    return function (json: CssModiferAIResponse) {
      if (!selectedComponentId || selectedComponentId === "content-wrapper") {
        console.error("No selected component id");
        return;
      }

      const cssKeys = Object.keys(json.css);

      cssKeys.map((key) => {
        debouncedTreeComponentStyleUpdate(key, json.css[key]);
      });

      // const selectedComponent: CssModifer = {
      //   modifiers: json.css,
      //   selectedComponentId: selectedComponentId,
      // };

      // setModifier(selectedComponent);
    };
  };

  const closeModal = () => {
    close();
    setDescription("");
  };

  const form = useForm({
    initialValues: {
      type: type,
      description: "",
    },
  });

  useEffect(() => {
    switch (type) {
      case "COMPONENT":
        processTOMLStream({
          stream,
          handler: handleComponentGeneration({
            componentBeingAddedId,
            theme,
            updateTreeComponentChildren,
            tree,
            setTree,
            pages,
          }),
        });

        break;
      case "LAYOUT":
        processTOMLStream({
          stream,
          handler: handleLayoutGeneration({
            theme,
            tree,
            setTree,
            pages,
          }),
        });

        break;
      case "CSS_MODIFIER":
        processTOMLStream<CssModiferAIResponse>({
          stream,
          handler: handleCssGeneration(),
        });

        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stream]);

  const onSubmit = async (values: any) => {
    setIsLoading(true);
    closeModal();

    const onCloseOverride = async () => {
      if (type === "COMPONENT" || type === "LAYOUT") {
        if (componentBeingAddedId.current) {
          updateTreeComponent(componentBeingAddedId.current, {
            isBeingAdded: false,
          });
        }
      }

      await onClose();
    };

    await handleRequestContentStream(
      projectId,
      { type, pageName: pageTitle, description: values.description },
      startLoading,
      onMessage,
      onError,
      onOpen,
      onCloseOverride,
    );
  };

  // const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
  //   // Check if Enter key was pressed without Shift key
  //   if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
  //     event.preventDefault();

  //     onSubmit(form.values);
  //   }
  // };

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
        size="lg"
        opened={openedAIModal}
        onClose={closeModal}
        title="What would you like to automate?"
      >
        <form onSubmit={form.onSubmit(onSubmit)}>
          <Stack pb={60}>
            <Flex align="center">
              <Text size="sm" italic c="dimmed">
                You can change design by pasting in CSS or add new components
                and APIs.
              </Text>
              <Select
                value={type}
                onChange={(value) => setType(value as AIRequestTypes)}
                data={[
                  {
                    label: "Change styling",
                    value: "CSS_MODIFIER",
                  },
                  {
                    label: "Add components",
                    value: "COMPONENT",
                  },
                  {
                    label: "Add an API",
                    value: "API",
                  },
                  {
                    label: "Change layout",
                    value: "LAYOUT",
                  },
                  {
                    label: "Add a page",
                    value: "PAGE_NAMES",
                  },
                ]}
              ></Select>
            </Flex>
            <AITextArea
              placeholder={
                descriptionPlaceholderMapping[type as AIRequestTypes]
                  .placeholder
              }
              onChange={(value) => {
                form.setFieldValue("description", value);
                setDescription(value);
              }}
              onTypeChange={(newType) => {
                setType(newType);
              }}
              items={[
                {
                  name: "Add components",
                  icon: "IconComponents",
                  type: "COMPONENT",
                },
                {
                  name: "Change styling",
                  icon: "IconPalette",
                  type: "CSS_MODIFIER",
                },
                {
                  name: "Add an API",
                  icon: "IconDatabase",
                  type: "API",
                },
                {
                  name: "Change layout",
                  icon: "IconLayout",
                  type: "LAYOUT",
                },
                {
                  name: "Add a page",
                  icon: "IconFileDescription",
                  type: "PAGE_NAMES",
                },
              ]}
            />
            <Flex align="center" justify="space-between">
              <Badge
                size="lg"
                color="indigo"
                leftSection={
                  <Icon name="IconSparkles" style={{ marginTop: "6px" }} />
                }
              >
                Powered by AI
              </Badge>
              <Button
                leftIcon={<Icon name="IconSparkles" />}
                type="submit"
                disabled={isLoading}
                loading={isLoading}
              >
                Generate
              </Button>
            </Flex>
          </Stack>
        </form>
      </Modal>
    </>
  );
};
