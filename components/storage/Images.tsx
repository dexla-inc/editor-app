import { ActionIconDefault } from "@/components/ActionIconDefault";
import { useStorageQuery } from "@/hooks/reactQuery/useStorageQuery";
import { deleteFile, uploadFile } from "@/requests/storage/mutations";
import {
  UploadMultipleResponse,
  UploadResponse,
} from "@/requests/storage/types";
import { ICON_SIZE } from "@/utils/config";
import {
  Avatar,
  FileButton,
  Flex,
  Group,
  LoadingOverlay,
  Paper,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { memo, useCallback, useEffect, useMemo, useState } from "react";

type FileObj = { [key: string]: any };

export const Images = () => {
  const router = useRouter();
  const projectId = router.query.id as string;

  const [storedImages, setStoredImages] = useState<FileObj[]>([]);
  const [copied, setCopied] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [loading, { open: onLoading, close: offLoading }] =
    useDisclosure(false);

  const { data: files, invalidate } = useStorageQuery(projectId);

  // Filter storedImages based on searchText
  const filteredImages = useMemo(
    () =>
      storedImages.filter((image) =>
        image.name.toLowerCase().includes(searchText.toLowerCase()),
      ),
    [storedImages, searchText],
  );

  const isImagesEmpty =
    !loading && (storedImages.length === 0 || filteredImages.length === 0);

  const getPropFromResponse = (file: UploadResponse) => {
    const underscoreIndex = file.url.indexOf("_");
    if (underscoreIndex === -1) return;

    const name = file.url.substring(underscoreIndex + 1);
    const extensionIndex = name.lastIndexOf(".");
    const type =
      extensionIndex !== -1
        ? `Image.${name.substring(extensionIndex + 1)}`
        : "";

    return { name, type };
  };

  const handleImageStorage = (response: UploadMultipleResponse) => {
    const images = response.files.map((file) => ({
      name: getPropFromResponse(file)?.name,
      type: getPropFromResponse(file)?.type,
      url: file.url,
    }));

    setStoredImages(images);
  };

  const onUpload = useCallback(
    async (e: File[]) => {
      try {
        onLoading();
        await uploadFile(projectId, e, true);
        invalidate();
      } catch (error) {
        console.error("Error uploading file: ", error);
      } finally {
        offLoading();
      }
    },
    [projectId],
  );

  const copyImage = (url: string) => {
    setCopied(true);
    navigator.clipboard.writeText(url);
  };

  useEffect(() => {
    if (files) handleImageStorage(files as UploadMultipleResponse);
  }, [files]);

  useEffect(() => {
    const timer = setTimeout(() => copied && setCopied(false), 1000);
    return () => clearTimeout(timer);
  }, [copied]);

  const deleteImage = async (name: string) => {
    try {
      onLoading();
      await deleteFile(projectId, name);
      invalidate();
    } catch (error) {
      console.error("Error deleting file: ", error);
    } finally {
      offLoading();
    }
  };

  return (
    <Stack spacing="xs" mih={200}>
      <LoadingOverlay
        visible={loading}
        overlayOpacity={0.3}
        loaderProps={{ variant: "dots" }}
      />
      <Group noWrap>
        <TextInput
          icon={<IconSearch size={ICON_SIZE} />}
          placeholder="Search images"
          w="100%"
          onChange={(e) => setSearchText(e.currentTarget.value)}
        />
        <FileButton multiple onChange={onUpload} accept="image/*">
          {(props) => (
            <ActionIconDefault
              iconName="IconPhotoPlus"
              tooltip="Upload image"
              {...props}
            />
          )}
        </FileButton>
      </Group>

      {isImagesEmpty ? (
        <Group mt={10}>
          <Text italic lineClamp={1}>
            No images found
          </Text>
        </Group>
      ) : (
        <Stack>
          {filteredImages.map((image, index) => (
            <ImageItem
              key={image.id}
              image={image}
              onCopy={copyImage}
              onDelete={deleteImage}
              copied={copied}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
};

type ImageItemProps = {
  image: FileObj;
  onCopy: (url: string) => void;
  onDelete: (name: string) => void;
  copied: boolean;
};

const ImageItem = memo(
  ({ image, onCopy, onDelete, copied }: ImageItemProps) => {
    // Component logic for rendering each image item
    return (
      <Paper
        key={image.key}
        p={4}
        pos="relative"
        sx={{
          width: "100%",
          cursor: "pointer", // Ensure the cursor is a pointer over the entire Paper
          "&:hover .image-actions": {
            // Adjust the selector to target the actions on hover
            opacity: 1,
          },
        }}
      >
        <Group w="100%">
          <Avatar size={30} src={image.url} />
          <Text lineClamp={1} truncate size="xs" fw={500}>
            {image.name}
          </Text>
          <Paper
            display="flex"
            sx={{
              opacity: 0,
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              justifyContent: "center",
              alignItems: "center",
              transition: "opacity 0.3s ease",
              "&:hover": {
                opacity: 1,
              },
            }}
          >
            <Flex gap="xs">
              <ActionIconDefault
                iconName="IconCopy"
                tooltip={copied ? "copied" : "copy"}
                onClick={() => onCopy(image.url)}
              />
              <ActionIconDefault
                iconName="IconTrash"
                tooltip="delete"
                onClick={() => onDelete(image.name)}
              />
            </Flex>
          </Paper>
        </Group>
      </Paper>
    );
  },
);

ImageItem.displayName = "ImageItem";
