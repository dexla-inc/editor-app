import AssetImageItem from "@/components/storage/AssetImageItem";
import { useStorageQuery } from "@/hooks/reactQuery/useStorageQuery";
import { deleteFile } from "@/requests/storage/mutations";
import { LARGE_ICON_SIZE } from "@/utils/config";
import { Stack, Text } from "@mantine/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Icon } from "../Icon";

type Props = {
  search: string;
  projectId: string;
};

export const AssetImages = ({ search, projectId }: Props) => {
  const [copied, setCopied] = useState(false);

  const { data: images, invalidate } = useStorageQuery(projectId);

  const filteredImages = useMemo(
    () =>
      images?.filter((image) =>
        image.name.toLowerCase().includes(search.toLowerCase()),
      ) || [],
    [images, search],
  );
  const isImagesEmpty = filteredImages.length === 0;

  const copyImage = useCallback((url: string) => {
    setCopied(true);
    navigator.clipboard.writeText(url);
  }, []);

  const deleteImage = useCallback(
    async (name: string) => {
      try {
        await deleteFile(projectId, name);
        invalidate();
      } catch (error) {
        console.error("Error deleting file: ", error);
      }
    },
    [projectId],
  );

  useEffect(() => {
    const timer = setTimeout(() => copied && setCopied(false), 1000);
    return () => clearTimeout(timer);
  }, [copied]);

  return isImagesEmpty ? (
    <Stack align="center" mt="xl">
      <Icon name="IconPhotoOff" size={LARGE_ICON_SIZE} />
      <Text>No images found</Text>
    </Stack>
  ) : (
    <Stack>
      {filteredImages.map((image, index) => (
        <AssetImageItem
          key={image.id ?? index}
          image={image}
          onCopy={copyImage}
          onDelete={deleteImage}
          copied={copied}
        />
      ))}
    </Stack>
  );
};
