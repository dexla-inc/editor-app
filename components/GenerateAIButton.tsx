import { AIRequestTypes } from "@/requests/ai/types";
import { PageResponse } from "@/requests/pages/types";
import { useAppStore } from "@/stores/app";
import { MantineThemeExtended, useEditorStore } from "@/stores/editor";
import { ICON_SIZE } from "@/utils/config";
import {
  Component,
  EditorTree,
  addComponent,
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
import { ActionIcon, Button, Modal, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconSparkles } from "@tabler/icons-react";
import cloneDeep from "lodash.clonedeep";
import { useRouter } from "next/router";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { AITextArea } from "./AITextArea";

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

type GenerateAIButtonProps = {
  projectId: string;
  pageTitle?: string | undefined;
};

type DescriptionPlaceHolderType = {
  description: string;
  placeholder: string;
  replaceText: string;
};

export const GenerateAIButton = ({ projectId }: GenerateAIButtonProps) => {
  const [openedAIModal, { open, close }] = useDisclosure(false);
  const [type, setType] = useState<AIRequestTypes>("COMPONENT");
  const [description, setDescription] = useState("");
  const [descriptionPlaceholder, setDescriptionPlaceholder] =
    useState<DescriptionPlaceHolderType>(descriptionPlaceholderMapping[type]);
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
  const [stream, setStream] = useState<string>("");

  const { onMessage, onError, onOpen, onClose } = createHandlers({
    setStream,
    type,
    componentBeingAddedId,
    updateTreeComponent,
    setIsLoading,
    stopLoading,
  });

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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stream, type]);

  const onSubmit = async (values: any) => {
    setIsLoading(true);
    closeModal();

    await handleRequestContentStream(
      projectId,
      { type, pageName: pageTitle, description: values.description },
      startLoading,
      onMessage,
      onError,
      onOpen,
      onClose,
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
        size="md"
        opened={openedAIModal}
        onClose={closeModal}
        title="Generate AI Content"
      >
        <form onSubmit={form.onSubmit(onSubmit)}>
          <Stack pb={150}>
            <AITextArea
              value={description}
              onChange={(value) => {
                form.setFieldValue("description", value);
                setDescription(value);
              }}
              items={[
                {
                  name: "API",
                  icon: "IconDatabase",
                },
                {
                  name: "Components",
                  icon: "IconComponents",
                },
                {
                  name: "Layout",
                  icon: "IconLayout",
                },
                {
                  name: "Page",
                  icon: "IconFileDescription",
                },
              ]}
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
          {/* <List
              spacing="xs"
              size="sm"
              center
              icon={
                <ThemeIcon color="teal" size={24} radius="xl">
                  <Icon name="IconCircleCheck" />
                </ThemeIcon>
              }
            >
              <List.Item>Components</List.Item>
              <List.Item>API</List.Item>
              <List.Item>Layout</List.Item>
              <List.Item>aa</List.Item>
              <List.Item
                icon={
                  <ThemeIcon color="blue" size={24} radius="xl">
                    <Icon name="IconCircleDashed" />
                  </ThemeIcon>
                }
              >
                aaa
              </List.Item>
            </List> */}
        </form>
      </Modal>
    </>
  );
};
