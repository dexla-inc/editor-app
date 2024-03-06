import AIPromptTextareaInput from "@/components/AIPromptTextareaInput";
import { THIN_DARK_OUTLINE, THIN_GREEN_OUTLINE } from "@/utils/branding";
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

  const resetState = () => {
    setDescription("");
  };

  const onClick = async () => {
    console.warn("Need to implement again");
  };

  return (
    <Popover
      width={500}
      position="bottom-start"
      withArrow
      shadow="md"
      onClose={resetState}
      withinPortal
    >
      <Popover.Target>
        <UnstyledButton
          placeholder="How can I help you?"
          w={250}
          p={6}
          sx={(theme) => ({
            borderRadius: theme.radius.sm,
            backgroundColor:
              theme.colorScheme === "dark" ? theme.black : theme.white,
            color: theme.colors.gray[9],
            fontSize: theme.fontSizes.sm,
            border:
              theme.colorScheme === "dark"
                ? THIN_DARK_OUTLINE
                : THIN_GREEN_OUTLINE,
            "&:hover": {
              outline: THIN_GREEN_OUTLINE,
            },
          })}
        >
          <Flex align="center" gap="xs">
            <IconSparkles size={ICON_SIZE} color={theme.colors.teal[6]} />
            <Text color="grey" size="xs">
              How can I help you today?
            </Text>
          </Flex>
        </UnstyledButton>
      </Popover.Target>
      <Popover.Dropdown>
        <AIPromptTextareaInput
          onClick={onClick}
          placeholder="Try something like 'Use the screenshot attached to build out a similar layout'"
          description={description}
          setDescription={setDescription}
          maxRows={8}
        />
      </Popover.Dropdown>
    </Popover>
  );
}
