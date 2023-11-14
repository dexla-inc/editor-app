import { convertToBase64 } from "@/utils/common";
import { ICON_SIZE } from "@/utils/config";
import {
  ActionIcon,
  Button,
  FileButton,
  Flex,
  Group,
  Image,
  Paper,
  Stack,
  Textarea,
  TextareaProps,
} from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { IconPhoto, IconSparkles } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { Icon } from "./Icon";

type Props = {
  description: string;
  setDescription: (description: string) => void;
  onClick: (screenshot?: string) => Promise<void>;
  placeholder: string;
} & Omit<TextareaProps, "onClick">;

export default function AIPromptTextareaInput({
  description,
  setDescription,
  onClick,
  placeholder,
  ...props
}: Props) {
  const [screenshot, setScreenshot] = useState<FileWithPath | null>(null);
  const resetRef = useRef<() => void>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const clearScreenshot = () => {
    setScreenshot(null);

    resetRef.current?.();
  };

  const handlePaste = (event: any) => {
    const items = (event.clipboardData || event.originalEvent.clipboardData)
      .items;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          setScreenshot(blob);
        }
      }
    }
  };

  const handleGenerateClick = async () => {
    setIsLoading(true); // Set isLoading to true before making the request

    if (screenshot) {
      const base64 = await convertToBase64(screenshot);
      await onClick(base64);
    } else {
      await onClick();
    }

    setIsLoading(false); // Set isLoading back to false when the request completes
  };

  return (
    <Stack spacing={0} bg="white">
      {screenshot && (
        <Group>
          <Paper
            pos="relative"
            sx={{
              "&:hover > div": {
                opacity: 1,
              },
            }}
          >
            <Image
              alt={screenshot.name}
              src={URL.createObjectURL(screenshot)}
              imageProps={{
                onLoad: () =>
                  URL.revokeObjectURL(URL.createObjectURL(screenshot)),
              }}
              width={50}
              height={50}
              fit="contain"
            />
            <Paper
              display="flex"
              onClick={clearScreenshot}
              w={50}
              h={50}
              sx={{
                opacity: 0,
                position: "absolute",
                top: 0,
                left: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                justifyContent: "center",
                alignItems: "center",
                transition: "opacity 0.3s ease",
                "&:hover": {
                  cursor: "pointer",
                },
              }}
            >
              <Icon
                name="IconTrash"
                color="white"
                onClick={clearScreenshot}
                size={ICON_SIZE}
              ></Icon>
            </Paper>
          </Paper>
        </Group>
      )}
      <Flex align="center">
        <FileButton onChange={setScreenshot} accept="image/png,image/jpeg">
          {(props) => (
            <ActionIcon {...props} variant="transparent">
              <IconPhoto size={ICON_SIZE} />
            </ActionIcon>
          )}
        </FileButton>

        <Textarea
          placeholder={placeholder}
          value={description}
          onChange={(event) => setDescription(event.currentTarget.value)}
          onPaste={handlePaste}
          autoFocus
          autosize
          my="sm"
          w={500}
          sx={{
            "& textarea": {
              // Have to target the nested textarea element
              border: "none",
              paddingTop: 0,
            },
          }}
          {...props}
        />
      </Flex>
      <Group position="apart">
        <Button variant="default" compact disabled>
          Try example
        </Button>
        <Button
          onClick={handleGenerateClick}
          leftIcon={<IconSparkles size={ICON_SIZE} />}
          compact
          //disabled={prompt.length === 0}
          loading={isLoading}
        >
          Generate
        </Button>
      </Group>
    </Stack>
  );
}
