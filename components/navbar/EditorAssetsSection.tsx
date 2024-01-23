import { Images } from "@/components/storage/Images";
import { Tabs } from "@mantine/core";

const FONT_SIZE = 12;

export const EditorAssetsSection = () => {
  return (
    <Tabs variant="default" defaultValue="images">
      <Tabs.List grow>
        <Tabs.Tab value="images" sx={{ fontSize: FONT_SIZE }}>
          Images
        </Tabs.Tab>
        <Tabs.Tab value="audios" sx={{ fontSize: FONT_SIZE }} disabled>
          Audio
        </Tabs.Tab>
        <Tabs.Tab value="videos" sx={{ fontSize: FONT_SIZE }} disabled>
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
  );
};
