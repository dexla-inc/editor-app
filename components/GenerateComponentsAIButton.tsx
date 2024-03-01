import { Icon } from "@/components/Icon";
import { AITextArea } from "@/components/ai/AITextArea";
import { AIRequestTypes } from "@/requests/ai/types";
import { PageResponse } from "@/requests/pages/types";
import { useAppStore } from "@/stores/app";
import { MantineThemeExtended, useEditorStore } from "@/stores/editor";
import {
  Component,
  EditorTree,
  Row,
  addComponent,
  getComponentBeingAddedId,
  getNewComponents,
} from "@/utils/editor";
import {
  createHandlers,
  descriptionPlaceholderMapping,
  handleRequestContentStream,
  processTOMLStream,
} from "@/utils/streamingAI";
import { Badge, Button, Flex, Modal, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
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

export const GenerateComponentsAIButton = () => {
  const [openedAIModal, { open, close }] = useDisclosure(false);
  const [type, setType] = useState<AIRequestTypes>("COMPONENT");
  const [description, setDescription] = useState("");
  const stopLoading = useAppStore((state) => state.stopLoading);
  const startLoading = useAppStore((state) => state.startLoading);
  const [isLoading, setIsLoading] = useState(false);
  const pages = useEditorStore((state) => state.pages);
  const router = useRouter();
  const projectId = router.query.id as string;
  const componentBeingAddedId = useRef<string>();
  const setTree = useEditorStore((state) => state.setTree);
  const updateTreeComponentChildren = useEditorStore(
    (state) => state.updateTreeComponentChildren,
  );
  const tree = useEditorStore((state) => state.tree);
  const theme = useEditorStore((state) => state.theme);

  const closeModal = () => {
    close();
    setDescription("");
  };

  const [stream, setStream] = useState<string>("");

  const { onMessage, onError, onOpen, onClose } = createHandlers({
    setStream,
    setIsLoading,
    stopLoading,
  });

  const componentGenerationHandler = (params: ComponentGenerationProps) => {
    return function (tomlData: any) {
      const {
        componentBeingAddedId,
        theme,
        updateTreeComponentChildren,
        setTree,
        pages,
        tree,
      } = params;

      const newComponents = getNewComponents(tomlData, theme, pages, true);

      const id = getComponentBeingAddedId();

      if (!id) {
        const copy = cloneDeep(tree);
        // TODO: get this back
        // addComponent(copy.root, newComponents, {
        //   id: "content-wrapper",
        //   edge: "bottom",
        // });
        // setTree(copy, { action: `Added ${newComponents.name}` });
      } else {
        componentBeingAddedId.current = id;
        // TODO: get this back
        // updateTreeComponentChildren(id, newComponents.children!);
      }
    };
  };

  useEffect(() => {
    processTOMLStream<Row[]>({
      stream,
      handler: componentGenerationHandler({
        componentBeingAddedId,
        theme,
        updateTreeComponentChildren,
        tree,
        setTree,
        pages,
      }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stream, type]);

  const form = useForm({
    initialValues: {
      type: type,
      description: "",
    },
  });

  const onSubmit = async (values: any) => {
    setIsLoading(true);
    closeModal();

    const onCloseOverride = async () => {
      if (componentBeingAddedId.current) {
        const updateTreeComponent =
          useEditorStore.getState().updateTreeComponent;

        updateTreeComponent({
          componentId: componentBeingAddedId.current,
          props: {
            isBeingAdded: false,
          },
        });
      }

      await onClose();
    };

    await handleRequestContentStream(
      projectId,
      { type, description: description },
      startLoading,
      onMessage,
      onError,
      onOpen,
      onCloseOverride,
    );
  };

  return (
    <>
      {/* <Tooltip label="Type in English" withArrow fz="xs">
        <Button
          onClick={open}
          color="dark"
          compact
          leftIcon={<Icon name="IconSparkles"></Icon>}
          loading={isLoading}
        >
          Build with AI
        </Button>
      </Tooltip> */}
      <Modal
        size="lg"
        opened={openedAIModal}
        onClose={closeModal}
        title="Build component layouts with AI"
      >
        <form onSubmit={form.onSubmit(onSubmit)}>
          <Stack pb={60}>
            <Flex align="center">
              <Text size="sm" italic c="dimmed">
                You can build layouts for your components using AI. (e.g. Add
                two buttons apart from each other with text below saying
                Welcome!)
              </Text>
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
              ]}
            />
            <Flex align="center" justify="space-between">
              <Badge color="indigo" leftSection={<Icon name="IconSparkles" />}>
                Powered by AI
              </Badge>
              <Button
                leftIcon={<Icon name="IconSparkles" />}
                type="submit"
                disabled={isLoading}
                loading={isLoading}
                color="dark"
                compact
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
