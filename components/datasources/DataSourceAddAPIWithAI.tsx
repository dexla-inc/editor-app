import { AITextArea } from "@/components/AITextArea";
import { Icon } from "@/components/Icon";
import ApiInfoForm from "@/components/datasources/ApiInfoForm";
import { ApiFromAI } from "@/requests/datasources/types";
import { useAppStore } from "@/stores/app";
import {
  createHandlers,
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
  const type = "API" as const;
  const [stream, setStream] = useState<string>("");
  const isLoading = useAppStore((state) => state.isLoading);
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const startLoading = useAppStore((state) => state.startLoading);

  const [description, setDescription] = useState<string>("");
  const [api, setApi] = useState<ApiFromAI | null>(null);

  const { onMessage, onError, onOpen, onClose } = createHandlers({
    setStream,
    type,
    stopLoading,
    setIsLoading,
  });

  const handleAIGeneration = async () => {
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

  const handleApiGeneration = () => {
    return function (tomlData: any) {
      setApi(tomlData.api as ApiFromAI);
    };
  };

  useEffect(() => {
    processTOMLStream<ApiFromAI>({
      stream,
      handler: handleApiGeneration(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stream, type]);

  return (
    <Container py="xl">
      <Stack spacing="xl">
        <Title order={2}>Data Source Settings</Title>
        <AITextArea
          value={description}
          onChange={(value) => {
            setDescription(value);
          }}
          items={[
            {
              name: "API",
              icon: "IconApi",
            },
            {
              name: "API Endpoint",
              icon: "IconApiApp",
            },
          ]}
        />
        <Button
          variant="light"
          leftIcon={<Icon name="IconSparkles" />}
          onClick={() => handleAIGeneration()}
          loading={isLoading}
        >
          Generate
        </Button>
        {api && <ApiInfoForm api={api} projectId={projectId} />}
      </Stack>
    </Container>
  );
}
