// ImageItem.tsx
import { ActionIconDefault } from "@/components/ActionIconDefault";
import { FileObj } from "@/requests/storage/types";
import { TRANSPARENT_COLOR } from "@/utils/branding";
import { Avatar, Flex, Group, Paper, Text } from "@mantine/core";
import React, { useMemo } from "react";

type Props = {
  image: FileObj;
  copied: boolean;
  onCopy: (url: string) => void;
  onDelete: (name: string) => void;
};

const AssetImageItem: React.FC<Props> = ({
  image,
  copied,
  onCopy,
  onDelete,
}) => {
  const imageActions = useMemo(
    () => (
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
    ),
    [image.url, image.name, copied, onCopy, onDelete],
  );

  return (
    <Paper
      key={image.key}
      p={4}
      pos="relative"
      sx={{
        width: "100%",
        cursor: "pointer",
        "&:hover .image-actions": { opacity: 1 },
      }}
    >
      <Group w="100%">
        <Flex align="center" gap="xs" w={230}>
          <Avatar size={30} src={image.url} />
          <Text truncate size="xs">
            {image.name}
          </Text>
        </Flex>
        <Paper
          display="flex"
          sx={{
            opacity: 0,
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: TRANSPARENT_COLOR,
            justifyContent: "center",
            alignItems: "center",
            transition: "opacity 0.3s ease",
            "&:hover": { opacity: 1 },
          }}
        >
          {imageActions}
        </Paper>
      </Group>
    </Paper>
  );
};

export default AssetImageItem;
