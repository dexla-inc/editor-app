import { deleteFile, uploadFile } from "@/requests/storage/mutations";
import { getAllFiles } from "@/requests/storage/queries-noauth";
import {
  UploadMultipleResponse,
  UploadResponse,
} from "@/requests/storage/types";
import { useEditorStore } from "@/stores/editor";
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
import { useEffect, useMemo, useState } from "react";

type Props = {
  expand: boolean;
};

type FileObj = { [key: string]: any };

export const Images = ({ expand }: Props) => {
  const router = useRouter();
  const projectId = router.query.id as string;
  const theme = useEditorStore((state) => state.theme);

  const [storedImages, setStoredImages] = useState<FileObj[]>([]);
  const [copied, setCopied] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [loading, { open: onLoading, close: offLoading }] =
    useDisclosure(false);

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

  const onUpload = async (e: File[]) => {
    try {
      onLoading();
      await uploadFile(projectId, e, true);
      const response = await getAllFiles(projectId);
      handleImageStorage(response as UploadMultipleResponse);
    } catch (error) {
      console.error("Error uploading file: ", error);
    } finally {
      offLoading();
    }
  };

  const copyImage = (url: string) => {
    setCopied(true);
    navigator.clipboard.writeText(url);
  };

  useEffect(() => {
    const timer = setTimeout(() => copied && setCopied(false), 1000);
    return () => clearTimeout(timer);
  }, [copied]);

  const deleteImage = async (name: string) => {
    try {
      onLoading();
      await deleteFile(projectId, name);
      const response = await getAllFiles(projectId);
      handleImageStorage(response as UploadMultipleResponse);
    } catch (error) {
      console.error("Error deleting file: ", error);
    } finally {
      offLoading();
    }
  };

  useEffect(() => {
    const loadData = async () => {
      onLoading();
      const response = await getAllFiles(projectId);
      handleImageStorage(response as UploadMultipleResponse);
      offLoading();
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                      ~{image.type}
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
                        onClick={() => deleteImage(image.name)}
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
