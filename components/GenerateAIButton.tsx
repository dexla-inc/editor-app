import { AIRequestTypes } from "@/requests/ai/types";
import { useAppStore } from "@/stores/app";
import { useEditorStore } from "@/stores/editor";
import { ICON_SIZE } from "@/utils/config";
import {
  createHandlers,
  descriptionPlaceholderMapping,
  handleRequestContentStream,
  processTOMLStream,
} from "@/utils/streamingAI";
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
import { IconSparkles } from "@tabler/icons-react";
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

  const handleTypeChange = (value: AIRequestTypes) => {
    setType(value);
    setDescriptionPlaceholder(descriptionPlaceholderMapping[value]);
  };

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
    processTOMLStream({
      type,
      stream,
      componentBeingAddedId,
      theme,
      updateTreeComponentChildren,
      setTree,
      pages,
      tree,
    });
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
                form.setFieldValue("type", value as AIRequestTypes);
                handleTypeChange(value as AIRequestTypes);
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
                  event.currentTarget.value as string,
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
