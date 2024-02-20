import { Icon } from "@/components/Icon";
import { ICON_MEDIUM_SIZE, ICON_SIZE, LARGE_ICON_SIZE } from "@/utils/config";
import {
  ActionIcon,
  Box,
  FileButton,
  Flex,
  Image,
  Overlay,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  Tooltip,
} from "@mantine/core";
import { IconPhoto } from "@tabler/icons-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type Props = {
  screenshots: File[];
  setScreenshots: Dispatch<SetStateAction<File[]>>;
};

export default function ScreenshotUploader({
  screenshots,
  setScreenshots,
}: Props) {
  const [isDragging, setIsDragging] = useState(false);

  const previews = screenshots.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <Image
        alt={file.name}
        key={index}
        src={imageUrl}
        imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
        width={220}
        height={140}
        fit="cover"
      />
    );
  });

  const removeFile = (index: number) => {
    setScreenshots((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handlePaste = (event: any) => {
    const items = (event.clipboardData || event.originalEvent.clipboardData)
      .items;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          setScreenshots((prevScreenshots) => [...prevScreenshots, blob]);
        }
      }
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
        const fileArray: File[] = Array.from(files);
        setScreenshots(
          (prevScreenshots: File[]) =>
            [...prevScreenshots, ...fileArray] as File[],
        );
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
  }, [setScreenshots]);

  return (
    <Stack spacing="xl">
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
          Drop a PNG or JPG of a design anywhere.
        </Overlay>
      )}

      <Box>
        <Text fw={500} size="sm">
          Do you have designs or design inspiration?
        </Text>
        <Text size="xs" color="gray">
          Export designs from Figma, Sketch, Adobe XD, etc. Or take screenshots
          of designs you like from Dribbble, Behance, etc.
        </Text>
        <Flex align="center" pt={2}>
          <Tooltip
            position="top-start"
            label="Upload screenshot by dropping or pasting"
            fz="xs"
          >
            <Flex
              align="center"
              w="100%"
              sx={(theme) => ({
                border: "2px dashed " + BORDER_COLOR,
                paddingLeft: theme.spacing.md,
                borderRadius: theme.radius.sm,
                ":focus-within": {
                  borderColor: theme.colors.teal[6],
                },
              })}
            >
              <FileButton
                onChange={setScreenshots}
                accept="image/png,image/jpeg"
                multiple
              >
                {(actionIconProps) => (
                  <ActionIcon {...actionIconProps} variant="transparent">
                    <IconPhoto size={ICON_SIZE} />
                  </ActionIcon>
                )}
              </FileButton>

              <Textarea
                placeholder="Paste or Drop in PNG, JPEG format"
                onPaste={handlePaste}
                onKeyDown={(e) => {
                  if (!e.ctrlKey && !e.metaKey) {
                    e.preventDefault();
                  }
                }}
                autosize
                w="100%"
                sx={(theme) => ({
                  "& textarea": {
                    border: "none",
                    padding: theme.spacing.xl,
                  },
                })}
              />
            </Flex>
          </Tooltip>
        </Flex>
      </Box>

      <SimpleGrid
        cols={4}
        breakpoints={[
          { maxWidth: "md", cols: 3 },
          { maxWidth: "sm", cols: 1 },
        ]}
      >
        {previews.map((preview, index) => (
          <Paper
            key={preview.key}
            pos="relative"
            sx={{
              width: "220px",
              "&:hover > div": {
                opacity: 1,
              },
            }}
          >
            {preview}
            <Paper
              display="flex"
              onClick={() => removeFile(index)}
              sx={{
                opacity: 0,
                position: "absolute",
                top: 0,
                left: 0,
                width: "220px",
                height: "100%",
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
                onClick={() => removeFile(index)}
                size={LARGE_ICON_SIZE}
              ></Icon>
            </Paper>
          </Paper>
        ))}
      </SimpleGrid>
    </Stack>
  );
}
