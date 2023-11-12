import { uploadFile } from "@/requests/storage/mutations";
import { UploadMultipleResponse } from "@/requests/storage/types";
import { useEditorStore } from "@/stores/editor";
import { FileObj, useStorage } from "@/stores/storage";
import { ICON_SIZE } from "@/utils/config";
import {
  ActionIcon,
  Avatar,
  Button,
  FileButton,
  Flex,
  Grid,
  Group,
  LoadingOverlay,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCopy, IconSearch, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type Props = {
  expand: boolean;
};

export const Images = ({ expand }: Props) => {
  const router = useRouter();
  const projectId = router.query.id as string;
  const storedImages = useStorage((state) => state.storedImages);
  const [copied, setCopied] = useState(false);

  const setStoredImages = useStorage((state) => state.setStoredImages);
  const theme = useEditorStore((state) => state.theme);

  const [searchText, setSearchText] = useState("");
  const [loading, { open: onLoading, close: offLoading }] =
    useDisclosure(false);

  // Filter storedImages based on searchText
  const filteredImages = storedImages.filter((image) =>
    image.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  const isImagesEmpty =
    !storedImages || storedImages.length === 0 || filteredImages.length === 0;

  const handleImageStorage = (
    files: File[],
    response: UploadMultipleResponse,
  ) => {
    const respToMerge = response.files.map((file) => ({
      name: file.url.split("_")[1],
      url: file.url,
    }));

    const findItemUrl = (name: string) =>
      respToMerge.find((item) => item.name === name)?.url;

    const newStorageImages = files.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      url: findItemUrl(file.name),
    }));
    return newStorageImages;
  };

  const onUpload = async (e: File[]) => {
    onLoading();
    let newStoredImages: FileObj[] = [];
    const response = await uploadFile(projectId, e, true);
    const newImages = handleImageStorage(e, response as UploadMultipleResponse);
    if (isImagesEmpty) newStoredImages = [...newImages];
    else newStoredImages = [...storedImages, ...newImages];
    setStoredImages(newStoredImages);
    offLoading();
  };

  const copyImage = (url: string) => {
    setCopied(true);
    navigator.clipboard.writeText(url);
  };

  useEffect(() => {
    const timer = setTimeout(() => copied && setCopied(false), 1000);
    return () => clearTimeout(timer);
  }, [copied]);

  const deleteImage = (file: FileObj) => {
    const newStoredImages = storedImages.filter(
      (image) => image.url !== file.url,
    );
    setStoredImages(newStoredImages);
  };

  return (
    <Stack spacing="xs">
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
            <Button w="50%" {...props}>
              Upload image
            </Button>
          )}
        </FileButton>
      </Group>
      {isImagesEmpty ? (
        <Group mt={10}>
          <Text italic lineClamp={1}>
            {filteredImages.length === 0
              ? "No images found"
              : "There are no images in the storage"}
          </Text>
        </Group>
      ) : (
        <Grid
          justify="space-between"
          columns={expand ? 12.5 : 12}
          sx={{ gap: 10 }}
          m={5}
          mt={10}
        >
          {filteredImages.map((image, index) => (
            <Grid.Col
              key={index}
              w="100%"
              span={expand ? 6 : 12}
              sx={{
                cursor: "default",
              }}
            >
              <Group w="100%" noWrap>
                <Avatar size={30} src={image.url} />
                <Flex w="100%" align="center" justify="space-between">
                  <Group noWrap>
                    <Text
                      lineClamp={1}
                      truncate
                      size="sm"
                      fw={500}
                      w={400}
                      color={theme.colors.gray[6]}
                    >
                      {image.name}
                    </Text>
                    <Text
                      lineClamp={1}
                      truncate
                      size="sm"
                      color={theme.colors.gray[6]}
                    >
                      ~{image.size}KB
                    </Text>
                  </Group>
                  <Group spacing="0" noWrap>
                    <Tooltip
                      zIndex={100}
                      label={copied ? "copied" : "copy"}
                      withArrow
                      offset={0}
                      fz="xs"
                      pt={2}
                    >
                      <ActionIcon
                        onClick={() => copyImage(image.url)}
                        variant="subtle"
                      >
                        <IconCopy size={ICON_SIZE} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip
                      zIndex={100}
                      label="delete"
                      withArrow
                      offset={0}
                      fz="xs"
                      pt={2}
                    >
                      <ActionIcon
                        onClick={() => deleteImage(image)}
                        variant="subtle"
                      >
                        <IconTrash size={ICON_SIZE} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Flex>
              </Group>
            </Grid.Col>
          ))}
        </Grid>
      )}
    </Stack>
  );
};
