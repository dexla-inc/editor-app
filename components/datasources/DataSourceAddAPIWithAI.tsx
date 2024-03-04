import { Icon } from "@/components/Icon";
import { AITextArea } from "@/components/ai/AITextArea";
import ApiInfoForm from "@/components/datasources/ApiInfoForm";
import { AIRequestTypes } from "@/requests/ai/types";
import { ApiFromAI } from "@/requests/datasources/types";
import { useAppStore } from "@/stores/app";
import {
  createHandlers,
  descriptionPlaceholderMapping,
  handleRequestContentStream,
  processTOMLStream,
} from "@/utils/streamingAI";
import { Button, Container, Stack, Title } from "@mantine/core";
import { useEffect, useState } from "react";

type Props = {
  projectId: string;
};

export default function DataSourceAddAPIWithAI({ projectId }: Props) {
  // Generate the AI here, parse it and set the Api with API Endpoints
  const [type, setType] = useState<AIRequestTypes>("API");
  const [stream, setStream] = useState<string>("");
  const isLoading = useAppStore((state) => state.isLoading);
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const startLoading = useAppStore((state) => state.startLoading);

  const [description, setDescription] = useState<string>("");
  const [api, setApi] = useState<ApiFromAI | null>(null);

  const { onMessage, onError, onOpen, onClose } = createHandlers({
    setStream,
    stopLoading,
    setIsLoading,
  });

  const triggerAIGeneration = async () => {
    setIsLoading(true);

    await handleRequestContentStream(
      projectId,
      { type, description },
      startLoading,
      onMessage,
      onError,
      onOpen,
      onClose,
    );
  };

  const apiGenerationHandler = () => {
    return function (tomlData: any) {
      setApi(tomlData.api as ApiFromAI);
    };
  };

  useEffect(() => {
    processTOMLStream<ApiFromAI>({
      stream,
      handler: apiGenerationHandler(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stream, type]);

  return (
    <Container py="xl">
      <Stack spacing="xl">
        <Title order={2}>Data Source Settings</Title>
        <AITextArea
          onChange={(value) => {
            setDescription(value);
          }}
          placeholder={
            descriptionPlaceholderMapping[type as AIRequestTypes].placeholder
          }
          items={[
            {
              name: "API",
              icon: "IconApi",
              type: "API",
            },
            {
              name: "API Endpoint",
              icon: "IconApiApp",
              type: "API",
            },
          ]}
        />
        <Button
          variant="light"
          leftIcon={<Icon name="IconSparkles" />}
          onClick={() => triggerAIGeneration()}
          loading={isLoading}
        >
          Generate
        </Button>
        {api && <ApiInfoForm api={api} />}
      </Stack>
    </Container>
  );
}
