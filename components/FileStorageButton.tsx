import { Images } from "@/components/storage/Images";
import { ICON_SIZE } from "@/utils/config";
import {
  ActionIcon,
  Group,
  Modal,
  ScrollArea,
  Tabs,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconArrowsMaximize,
  IconArrowsMinimize,
  IconCloudStorm,
  IconMusic,
  IconPhoto,
  IconVideo,
} from "@tabler/icons-react";

export const FileStorageButton = () => {
  const [openStorageModal, { open, close }] = useDisclosure(false);
  const [expand, { toggle: toggleExpand }] = useDisclosure(false);
  return (
    <>
      <Tooltip label="File Storage" withArrow fz="xs">
        <ActionIcon onClick={open} variant="default">
          <IconCloudStorm size={ICON_SIZE} />
        </ActionIcon>
      </Tooltip>
      <Modal.Root
        fullScreen={expand}
        size="xl"
        opened={openStorageModal}
        onClose={close}
        scrollAreaComponent={ScrollArea.Autosize}
        xOffset={10}
      >
        <Modal.Overlay />
        <Modal.Content h="100%">
          <Modal.Header>
            <Modal.Title>User File Storage</Modal.Title>
            <Group sx={{ gap: 0 }} noWrap>
              <Tooltip
                fz={10}
                withArrow
                offset={0}
                label={expand ? "Minimize" : "Maximize"}
              >
                <ActionIcon onClick={toggleExpand}>
                  {expand ? (
                    <IconArrowsMinimize size={12} />
                  ) : (
                    <IconArrowsMaximize size={12} />
                  )}
                </ActionIcon>
              </Tooltip>
              <Tooltip fz={10} withArrow offset={0} label="Close">
                <Modal.CloseButton w={28} h={28} />
              </Tooltip>
            </Group>
          </Modal.Header>
          <Modal.Body>
            <Tabs variant="outline" defaultValue="images">
              <Tabs.List grow>
                <Tabs.Tab value="images" icon={<IconPhoto size={ICON_SIZE} />}>
                  Images
                </Tabs.Tab>
                <Tabs.Tab value="audios" icon={<IconMusic size={ICON_SIZE} />}>
                  Audio
                </Tabs.Tab>
                <Tabs.Tab value="videos" icon={<IconVideo size={ICON_SIZE} />}>
                  Video
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="images" pt="xs">
                <Images expand={expand} />
              </Tabs.Panel>

              <Tabs.Panel value="audios" pt="xs">
                Audios
              </Tabs.Panel>

              <Tabs.Panel value="videos" pt="xs">
                Videos
              </Tabs.Panel>
            </Tabs>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
};
