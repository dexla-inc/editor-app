import AIPromptTextareaInput from "@/components/AIPromptTextareaInput";
import { anyPrompt } from "@/requests/ai/queries";
import { AIResponseTypes } from "@/requests/ai/types";
import {
  GPT35_TURBO_MODEL,
  GPT4_MODEL,
  GPT4_PREVIEW_MODEL,
  GPT4_VISION_MODEL,
} from "@/utils/config";
import {
  getComponentScreenshotPrompt,
  getComponentsPrompt,
} from "@/utils/prompts";
import {
  Box,
  Flex,
  Group,
  SegmentedControl,
  Select,
  Stack,
} from "@mantine/core";
import { Prism } from "@mantine/prism";
import { useEffect, useState } from "react";

type Tabs = "prompts" | "freetype";
type PrompTemplates = "getComponentScreenshotPrompt" | "getComponentsPrompt";

export default function Playground() {
  const [aiResponse, setAiResponse] = useState<string>();
  const [tab, setTab] = useState<Tabs>("prompts");
  const [prompt, setPrompt] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [responseType, setResponseType] = useState<AIResponseTypes>("JSON");
  const [promptTemplate, setPromptTemplate] = useState<PrompTemplates | null>(
    "getComponentScreenshotPrompt",
  );
  const [model, setModel] = useState<string>(GPT4_VISION_MODEL);

  const onClick = async (base64Image?: string) => {
    const result = await anyPrompt(model, prompt, base64Image);

    setAiResponse(result);
  };

  useEffect(() => {
    let newPrompt;
    switch (promptTemplate) {
      case "getComponentScreenshotPrompt":
        newPrompt = getComponentScreenshotPrompt({ description, responseType });
        break;
      case "getComponentsPrompt":
        newPrompt = getComponentsPrompt({ description });
        break;
      default:
        newPrompt = prompt;
    }
    setPrompt(newPrompt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description, responseType, promptTemplate]);

  useEffect(() => {
    if (tab === "freetype") {
      setResponseType("NORMAL");
      setPromptTemplate(null);
      setPrompt(description);
      setAiResponse("Text will appear here");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  useEffect(() => {
    if (tab === "freetype") {
      setPrompt(description);
    } else if (tab === "prompts") {
      setPromptTemplate("getComponentScreenshotPrompt");
      setResponseType("JSON");
      setAiResponse("// Code will appear here");
    }
  }, [tab, description]);

  return (
    <Stack m="lg">
      <Flex gap="lg" justify="space-between">
        <Stack>
          <SegmentedControl
            value={tab}
            onChange={(value) => setTab(value as Tabs)}
            data={[
              { label: "Pre-built Prompts", value: "prompts" },
              { label: "FreeType", value: "freetype" },
            ]}
          />
          <Group>
            <Select
              label="Model"
              value={model}
              onChange={(value) => setModel(value as string)}
              data={[
                { value: GPT4_PREVIEW_MODEL, label: GPT4_PREVIEW_MODEL },
                { value: GPT4_MODEL, label: GPT4_MODEL },
                { value: GPT4_VISION_MODEL, label: GPT4_VISION_MODEL },
                { value: GPT35_TURBO_MODEL, label: GPT35_TURBO_MODEL },
              ]}
              size="xs"
            />
          </Group>
          {tab === "prompts" && (
            <Group position="apart">
              <Select
                label="Prompt Template"
                value={promptTemplate}
                onChange={(value) => setPromptTemplate(value as PrompTemplates)}
                data={[
                  {
                    value: "getComponentScreenshotPrompt",
                    label: "Component Screenshot",
                  },
                  {
                    value: "getComponentsPrompt",
                    label: "Component",
                  },
                ]}
                size="xs"
              />
              <Select
                label="Response Type"
                value={responseType}
                onChange={(value) => setResponseType(value as AIResponseTypes)}
                data={[
                  { value: "JSON", label: "JSON" },
                  { value: "NORMAL", label: "Normal" },
                  { value: "TOML", label: "TOML" },
                  { value: "QUEUE", label: "Queue" },
                ]}
                size="xs"
              />
            </Group>
          )}
          <Box
            p="sm"
            sx={(theme) => ({
              borderRadius: theme.radius.sm,
              border: "1px solid" + theme.colors.gray[2],
              "&:hover": {
                outline: "1px solid" + theme.colors.gray[2],
              },
            })}
          >
            <AIPromptTextareaInput
              onClick={onClick}
              placeholder={
                tab === "freetype"
                  ? "Type what ever you like"
                  : "Select one of our predefined prompts"
              }
              description={description}
              setDescription={setDescription}
              maxRows={30}
            />
          </Box>
        </Stack>
        <Stack
          bg="dark"
          w="100%"
          maw={1000}
          sx={(theme) => ({ borderRadius: theme.radius.sm })}
        >
          <Prism
            language={responseType === "JSON" ? "json" : "markdown"}
            colorScheme="dark"
            w="100%"
            copyLabel="Copy to clipboard"
            copiedLabel="Copied to clipboard"
            m={0}
          >
            {(responseType === "JSON"
              ? JSON.stringify(aiResponse, null, 2)
              : aiResponse) ?? "// Code will appear here"}
          </Prism>
        </Stack>
      </Flex>
    </Stack>
  );
}
