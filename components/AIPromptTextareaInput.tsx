import { ErrorAlert } from "@/components/Alerts";
import { Icon } from "@/components/Icon";
import { LIGHT_MODE } from "@/utils/branding";
import { convertToBase64 } from "@/utils/common";
import { ICON_MEDIUM_SIZE, ICON_SIZE } from "@/utils/config";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  FileButton,
  Flex,
  Group,
  Image,
  Overlay,
  Paper,
  Stack,
  Textarea,
  TextareaProps,
  Tooltip,
} from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { IconPhoto, IconSparkles } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";

type Props = {
  description: string;
  setDescription: (description: string) => void;
  onClick: (screenshot?: string) => Promise<void>;
  placeholder: string;
  disabled?: boolean;
} & Omit<TextareaProps, "onClick">;

export default function AIPromptTextareaInput({
  description,
  setDescription,
  onClick,
  placeholder,
  disabled,
  ...props
}: Props) {
  const [screenshot, setScreenshot] = useState<FileWithPath | null>(null);
  const resetRef = useRef<() => void>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

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
    try {
      setIsLoading(true);

      if (screenshot) {
        const base64 = await convertToBase64(screenshot);
        await onClick(base64);
      } else {
        await onClick();
      }

      setIsLoading(false);
    } catch (error) {
      setErrorText(
        "There has been a problem, try again by including more information.",
      );
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      handleGenerateClick();
    }
  };

  useEffect(() => {
    let dragCounter = 0;
    let dragTimeout: any;

    const handleDragEnter = (event: any) => {
      event.preventDefault();
      dragCounter++;
      setIsDragging(true);
    };

    const handleDragOver = (event: any) => {
      event.preventDefault();
    };

    const handleDrop = (event: any) => {
      event.preventDefault();
      dragCounter = 0; // Reset counter on drop
      clearTimeout(dragTimeout);
      setIsDragging(false);
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith("image/")) {
          setScreenshot(file);
        }
      }
    };

    const handleDragLeave = (event: any) => {
      event.preventDefault();
      dragCounter--;
      if (dragCounter === 0) {
        dragTimeout = setTimeout(() => {
          setIsDragging(false);
        }, 100);
      }
    };

    document.addEventListener("dragenter", handleDragEnter);
    document.addEventListener("dragover", handleDragOver);
    document.addEventListener("drop", handleDrop);
    document.addEventListener("dragleave", handleDragLeave);

    return () => {
      document.removeEventListener("dragenter", handleDragEnter);
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("drop", handleDrop);
      document.removeEventListener("dragleave", handleDragLeave);
    };
  }, []);

  return (
    <Stack
      spacing={0}
      sx={(theme) => ({
        background: theme.colorScheme === "dark" ? "transparent" : LIGHT_MODE,
      })}
    >
      {isDragging && (
        <Overlay
          zIndex={1000}
          sx={(theme) => ({
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: theme.radius.sm,
          })}
        >
          <IconPhoto size={ICON_MEDIUM_SIZE} style={{ marginRight: "8px" }} />
          Drop a PNG or JPG of a design here.
        </Overlay>
      )}

      {errorText && <ErrorAlert title="Error" text={errorText}></ErrorAlert>}
      <Group position="apart" align="self-start">
        {screenshot ? (
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
        ) : (
          <Box></Box>
        )}
        <Badge color="dark" size="xs">
          ESC to Close
        </Badge>
      </Group>
      <Flex align="center">
        <Tooltip label="Upload screenshot" fz="xs">
          <FileButton onChange={setScreenshot} accept="image/png,image/jpeg">
            {(actionIconProps) => (
              <ActionIcon {...actionIconProps} variant="transparent">
                <IconPhoto size={ICON_SIZE} />
              </ActionIcon>
            )}
          </FileButton>
        </Tooltip>

        <Textarea
          placeholder={placeholder}
          value={description}
          onChange={(event) => setDescription(event.currentTarget.value)}
          onKeyDown={handleKeyDown}
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
        <Tooltip label="Coming soon" fz="xs">
          <Button variant="default" compact disabled>
            Try example
          </Button>
        </Tooltip>
        <Button
          onClick={handleGenerateClick}
          leftIcon={<IconSparkles size={ICON_SIZE} />}
          compact
          disabled={
            disabled || (description.length === 0 && screenshot === null)
          }
          loading={isLoading}
        >
          Generate
        </Button>
      </Group>
    </Stack>
  );
}
