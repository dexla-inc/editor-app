import { Stack, Text } from "@mantine/core";
import { DraggableComponent } from "@/components/DraggableComponent";

export const EditorNvbarComponentsSection = () => {
  return (
    <Stack>
      <DraggableComponent id="Text">
        <Text size="xs">Text</Text>
      </DraggableComponent>
    </Stack>
  );
};
