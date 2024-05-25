"use client";

import AIPromptTextareaInput from "@/components/AIPromptTextareaInput";
import { ErrorAlert } from "@/components/Alerts";
import { TopLabel } from "@/components/TopLabel";
import { anyPrompt } from "@/requests/ai/queries";
import { AIResponseTypes } from "@/requests/ai/types";
import { BORDER_COLOR } from "@/utils/branding";
import {
  GPT35_TURBO_1106_MODEL,
  GPT4_MODEL,
  GPT4_PREVIEW_MODEL,
  GPT4_VISION_MODEL,
} from "@/utils/config";
import {
  getComponentScreenshotPrompt,
  getComponentsPrompt,
  getFunctionalityPrompt,
  getPagesPrompt,
} from "@/utils/prompts";
import { getThemeScreenshotPrompt } from "@/utils/prompts-theme";
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
import { DashboardShell } from "@/components/DashboardShell";

type Tabs = "prompts" | "freetype";
type PrompTemplates =
  | "getComponentScreenshotPrompt"
  | "getComponentsPrompt"
  | "getFunctionalityPrompt"
  | "getThemeScreenshotPrompt"
  | "getPagesPrompt";

export default function Page() {
  const [aiResponse, setAiResponse] = useState<string>();
  const [tab, setTab] = useState<Tabs>("prompts");
  const [prompt, setPrompt] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [responseType, setResponseType] = useState<AIResponseTypes>("JSON");
  const [promptTemplate, setPromptTemplate] = useState<PrompTemplates | null>(
    "getComponentScreenshotPrompt",
  );
  const [model, setModel] = useState<string>(GPT4_VISION_MODEL);
  const [errorText, setErrorText] = useState<string>("");

  const onClick = async (base64Image?: string) => {
    if (base64Image && model !== GPT4_VISION_MODEL) {
      setErrorText("Only GPT-4 Vision is supported with screenshots.");
    } else {
      setErrorText("");

      const result = await anyPrompt(model, prompt, base64Image);
      setAiResponse(result);
    }
  };

  useEffect(() => {
    let newPrompt;
    switch (promptTemplate) {
      case "getThemeScreenshotPrompt":
        newPrompt = getThemeScreenshotPrompt({ description });
        break;
      case "getComponentScreenshotPrompt":
        newPrompt = getComponentScreenshotPrompt({ description, responseType });
        break;
      case "getComponentsPrompt":
        newPrompt = getComponentsPrompt({ description });
        break;
      case "getFunctionalityPrompt":
        newPrompt = getFunctionalityPrompt({ description });
        break;
      case "getPagesPrompt":
        newPrompt = getPagesPrompt({ appDescription: description });
        break;
      default:
        newPrompt = prompt;
    }
    setPrompt(newPrompt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description, responseType, promptTemplate]);

  useEffect(() => {
    if (tab === "freetype") {
      setPromptTemplate(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  useEffect(() => {
    setAiResponse(`${responseType} will appear here`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseType]);

  useEffect(() => {
    if (tab === "freetype") {
      setPrompt(description);
    } else if (tab === "prompts") {
      setResponseType("JSON");
    }
  }, [tab, description]);

  return (
    <DashboardShell>
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
              color="dark"
            />

            {errorText && (
              <ErrorAlert title="Error" text={errorText}></ErrorAlert>
            )}
            <Group position="apart" align="center">
              <Select
                label="Model"
                value={model}
                onChange={(value) => setModel(value as string)}
                data={[
                  { value: GPT4_PREVIEW_MODEL, label: GPT4_PREVIEW_MODEL },
                  { value: GPT4_MODEL, label: GPT4_MODEL },
                  { value: GPT4_VISION_MODEL, label: GPT4_VISION_MODEL },
                  {
                    value: GPT35_TURBO_1106_MODEL,
                    label: GPT35_TURBO_1106_MODEL,
                  },
                ]}
                size="xs"
              />
              <Stack spacing={2}>
                <TopLabel text="Response Type" />
                <SegmentedControl
                  value={responseType}
                  onChange={(value) =>
                    setResponseType(value as AIResponseTypes)
                  }
                  data={[
                    { value: "JSON", label: "JSON" },
                    { value: "TEXT", label: "Text" },
                    { value: "TOML", label: "TOML" },
                    { value: "QUEUE", label: "Queue" },
                  ]}
                  size="xs"
                  w={250}
                />
              </Stack>
            </Group>
            {tab === "prompts" && (
              <Group>
                <Select
                  label="Prompt Template"
                  value={promptTemplate}
                  onChange={(value) =>
                    setPromptTemplate(value as PrompTemplates)
                  }
                  data={[
                    {
                      value: "getComponentScreenshotPrompt",
                      label: "Screenshot",
                    },
                    {
                      value: "getThemeScreenshotPrompt",
                      label: "Branding",
                    },
                    {
                      value: "getFunctionalityPrompt",
                      label: "Functionality",
                    },
                    {
                      value: "getComponentsPrompt",
                      label: "Components",
                    },
                    {
                      value: "getPagesPrompt",
                      label: "Pages",
                    },
                  ]}
                  size="xs"
                />
              </Group>
            )}
            <Box
              p="sm"
              sx={(theme) => ({
                borderRadius: theme.radius.sm,
                border: "1px solid" + BORDER_COLOR,
                "&:hover": {
                  outline: "1px solid" + BORDER_COLOR,
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
                maxRows={25}
                disabled={tab === "prompts" && promptTemplate === null}
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
              mah={900}
            >
              {(responseType === "JSON"
                ? JSON.stringify(aiResponse, null, 2)
                : aiResponse) ?? "// Code will appear here"}
            </Prism>
          </Stack>
        </Flex>
      </Stack>
    </DashboardShell>
  );
}
