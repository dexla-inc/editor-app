import { Icon } from "@/components/Icon";
import { AITextArea } from "@/components/ai/AITextArea";
import { AIRequestTypes } from "@/requests/ai/types";
import { useAppStore } from "@/stores/app";
import { useEditorStore } from "@/stores/editor";
import {
  componentStyleMapper,
  debouncedTreeUpdate,
  getComponentById,
} from "@/utils/editor";
import { isKeyOfAISupportedModifiers } from "@/utils/modifiers";
import {
  createHandlers,
  descriptionPlaceholderMapping,
  handleRequestContentStream,
  processTOMLStream,
} from "@/utils/streamingAI";
import { Badge, Button, Flex, Modal, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/router";
import { useState } from "react";

type CssModiferAIResponse = {
  css: Record<string, string | number>;
};

export const GenerateStylesAIButton = () => {
  const [openedAIModal, { open, close }] = useDisclosure(false);
  const [type, setType] = useState<AIRequestTypes>("CSS_MODIFIER");
  const [description, setDescription] = useState("");
  const stopLoading = useAppStore((state) => state.stopLoading);
  const startLoading = useAppStore((state) => state.startLoading);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const projectId = router.query.id as string;

  const tree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentIds?.at(-1),
  );
  // const [stream, setStream] = useState<string>("");

  const setStream: any = {
    CSS_MODIFIER: (stream: string) => {
      processTOMLStream<CssModiferAIResponse>({
        stream,
        handler: handleCssGeneration(),
      });
    },
  } as const;

  const { onMessage, onError, onOpen, onClose } = createHandlers({
    setStream: setStream[type],
    setIsLoading,
    stopLoading,
  });

  const handleCssGeneration = () => {
    return function (json: CssModiferAIResponse) {
      if (!selectedComponentId || selectedComponentId === "content-wrapper") {
        console.error("No selected component id");
        return;
      }

      const style = Object.entries(json.css).reduce(
        (acc, [key, value]: [string, string | number]) => {
          const keyExists = isKeyOfAISupportedModifiers(key);

          if (keyExists) {
            acc[key] = value;
          } else {
            console.error(`Tell Tom! Unsupported key: ${key}`);
          }
          return acc;
        },
        {} as Record<string, string | number>,
      );

      const component = getComponentById(tree.root, selectedComponentId);

      debouncedTreeUpdate(
        selectedComponentId,
        componentStyleMapper(component?.name!, { style }),
      );
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

  const onSubmit = async (values: any) => {
    setIsLoading(true);
    closeModal();

    await handleRequestContentStream(
      projectId,
      { type, description: values.description },
      startLoading,
      onMessage,
      onError,
      onOpen,
      onClose,
    );
  };

  return (
    <>
      {/* <Button
        onClick={open}
        color="dark"
        compact
        leftIcon={<Icon name="IconSparkles"></Icon>}
        mx="md"
        loading={isLoading}
      >
        Style with AI
      </Button> */}
      <Modal
        size="lg"
        opened={openedAIModal}
        onClose={closeModal}
        title="Style with AI"
      >
        <form onSubmit={form.onSubmit(onSubmit)}>
          <Stack pb={60}>
            <Flex align="center">
              <Text size="sm" italic c="dimmed">
                You can change design for the selected component by pasting in
                CSS or typing in english (e.g. change direction to horizontal)
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
                  name: "Change styling",
                  icon: "IconPalette",
                  type: "CSS_MODIFIER",
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
