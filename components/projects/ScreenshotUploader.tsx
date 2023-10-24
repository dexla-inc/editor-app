import { Icon } from "@/components/Icon";
import { LARGE_ICON_SIZE } from "@/utils/config";
import { Box, Image, Paper, SimpleGrid, Stack, Text } from "@mantine/core";
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Dispatch, SetStateAction, useEffect } from "react";

type Props = {
  screenshots: FileWithPath[];
  setScreenshots: Dispatch<SetStateAction<FileWithPath[]>>;
};

export default function ScreenshotUploader({
  screenshots,
  setScreenshots,
}: Props) {
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
        fit="contain"
      />
    );
  });

  const onDropHandler = (newFiles: FileWithPath[]) => {
    setScreenshots((prevState) => [...prevState, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setScreenshots((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (screenshots.length > 0) console.log(screenshots);
  }, [screenshots]);

  return (
    <Stack spacing="xl">
      <Box>
        <Text fw={500} size="sm">
          Do you have designs or design inspiration?
        </Text>
        <Text size="xs" color="gray">
          Export designs from Figma, Sketch, Adobe XD, etc. Or take screenshots
          of designs you like from Dribbble, Behance, etc.
        </Text>

        <Dropzone onDrop={onDropHandler} accept={IMAGE_MIME_TYPE} mt={2}>
          <Text align="center">Drop here</Text>
          <Text size="xs" color="gray" align="center">
            {IMAGE_MIME_TYPE.join(", ")}
          </Text>
        </Dropzone>
      </Box>

      <SimpleGrid
        cols={4}
        breakpoints={[{ maxWidth: "sm", cols: 1 }]}
        mt={previews.length > 0 ? "xl" : 0}
      >
        {previews.map((preview, index) => (
          <Paper
            key={preview.key}
            pos="relative"
            sx={{
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
                width: "100%",
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
