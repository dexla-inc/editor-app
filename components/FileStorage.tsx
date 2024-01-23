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
  IconMusic,
  IconPhoto,
  IconVideo,
} from "@tabler/icons-react";

type Props = {
  uploadModal: boolean;
  closeUploadModal: () => void;
};

export const FileStorage = ({ uploadModal, closeUploadModal }: Props) => {
  const [expand, { toggle: toggleExpand }] = useDisclosure(false);
  return (
    <>
      <Modal.Root
        fullScreen={expand}
        size="xl"
        opened={uploadModal}
        onClose={closeUploadModal}
        scrollAreaComponent={ScrollArea.Autosize}
        xOffset={10}
        zIndex={300}
      >
        <Modal.Overlay />
        <Modal.Content h="100%">
          <Modal.Header>
            <Modal.Title fw="bolder" fz="xl">
              Uploads
            </Modal.Title>
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

              <Tabs.Panel value="images" pt="sm">
                <Images />
              </Tabs.Panel>

              <Tabs.Panel value="audios" pt="sm">
                Audios
              </Tabs.Panel>

              <Tabs.Panel value="videos" pt="sm">
                Videos
              </Tabs.Panel>
            </Tabs>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
};
