import { ActionIconDefault } from "@/components/ActionIconDefault";
import { AssetImages } from "@/components/storage/AssetImages";
import { useStorageQuery } from "@/hooks/editor/reactQuery/useStorageQuery";
import { useEditorParams } from "@/hooks/editor/useEditorParams";
import { uploadFile } from "@/requests/storage/mutations";
import { ICON_SIZE } from "@/utils/config";
import {
  FileButton,
  Group,
  LoadingOverlay,
  Stack,
  TextInput,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useCallback, useState } from "react";

export const AssetImageOverview = () => {
  const { id: projectId } = useEditorParams();
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { invalidate } = useStorageQuery(projectId);

  const onUpload = useCallback(
    async (e: File[]) => {
      try {
        setIsLoading(true);
        await uploadFile(projectId, e, true);
        invalidate();
      } catch (error) {
        console.error("Error uploading file: ", error);
      } finally {
        setIsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [projectId],
  );

  return (
    <Stack spacing="xs" mih={200}>
      <LoadingOverlay
        visible={isLoading}
        overlayOpacity={0.3}
        loaderProps={{ variant: "dots" }}
      />
      <Group noWrap>
        <TextInput
          icon={<IconSearch size={ICON_SIZE} />}
          placeholder="Search images"
          w="100%"
          onChange={(e) => setSearch(e.currentTarget.value)}
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
      <AssetImages search={search} projectId={projectId} />
    </Stack>
  );
};
