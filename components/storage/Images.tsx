import { uploadFile } from "@/requests/storage/mutations";
import { getFile } from "@/requests/storage/queries";
import { useStorage } from "@/stores/storage";
import { ICON_SIZE } from "@/utils/config";
import {
  Button,
  FileButton,
  Group,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

export const Images = () => {
  const router = useRouter();
  const projectId = router.query.id as string;
  const [files, setFiles] = useState<any[]>([]);
  const storedImages = useStorage((state) => state.storedImages);

  console.log(storedImages);

  const setStoredImages = useStorage((state) => state.setStoredImages);
  const isImagesEmpty = !storedImages || storedImages.length === 0;

  const onUpload = (e: File[]) => {
    let newStoredImages: File[] = [];
    if (isImagesEmpty) newStoredImages = [...e];
    else newStoredImages = [...storedImages, ...e];
    setStoredImages(newStoredImages);
    uploadFile(projectId, e, true);
  };

  const addImageUrlToStoredImages = useCallback(
    (arr: File[]) => {
      const newArr = arr.map(async (file) => {
        const url = await getFile(projectId, file.name);
        return { ...file, url };
      });
      setFiles(newArr);
      console.log(newArr);
    },
    [projectId],
  );

  useEffect(() => {
    if (isImagesEmpty) return;
    addImageUrlToStoredImages(storedImages);
  }, [storedImages, isImagesEmpty, addImageUrlToStoredImages]);

  return (
    <Stack spacing="xs">
      <Group noWrap>
        <TextInput
          icon={<IconSearch size={ICON_SIZE} />}
          placeholder="Search images"
          w="100%"
        />
        <FileButton multiple onChange={onUpload} accept=".*">
          {(props) => (
            <Button w="50%" {...props}>
              Upload image
            </Button>
          )}
        </FileButton>
      </Group>
      {isImagesEmpty ? (
        <Group mt={5}>
          <Text italic lineClamp={1}>
            There are no images in the storage
          </Text>
        </Group>
      ) : (
        ""
      )}
    </Stack>
  );
};
