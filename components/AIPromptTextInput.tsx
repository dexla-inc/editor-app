import AIPromptTextareaInput from "@/components/AIPromptTextareaInput";
import { generateStructureFromScreenshot } from "@/requests/ai/queries";
import { ICON_SIZE } from "@/utils/config";
import {
  Flex,
  Popover,
  Text,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { IconSparkles } from "@tabler/icons-react";
import { useState } from "react";

export default function AIPromptTextInput() {
  const theme = useMantineTheme();
  const [description, setDescription] = useState<string>("");

  const onClick = async (base64Image?: string) => {
    const result = await generateStructureFromScreenshot(
      description,
      "JSON",
      base64Image,
    );

    // Set the result to the editor
  };

  return (
    <Popover width={500} position="bottom-start" withArrow shadow="md">
      <Popover.Target>
        <UnstyledButton
          placeholder="How can I help you?"
          w={250}
          p={6}
          sx={(theme) => ({
            borderRadius: theme.radius.sm,
            backgroundColor: theme.white,
            color: theme.colors.gray[9],
            fontSize: theme.fontSizes.sm,
            border: "1px solid" + theme.colors.teal[6],
            "&:hover": {
              outline: "1px solid" + theme.colors.teal[6],
            },
          })}
        >
          <Flex align="center" gap="xs">
            <IconSparkles size={ICON_SIZE} color={theme.colors.teal[6]} />
            <Text color="grey">How can I help you today?</Text>
          </Flex>
        </UnstyledButton>
      </Popover.Target>
      <Popover.Dropdown>
        <AIPromptTextareaInput
          onClick={async () => onClick()}
          placeholder="Try something like 'Use the screenshot attached to build out a similar layout'"
          description={description}
          setDescription={setDescription}
          maxRows={8}
        />
      </Popover.Dropdown>
    </Popover>
  );
}
