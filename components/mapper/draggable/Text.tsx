import { DraggableComponent } from "@/components/DraggableComponent";
import { Text } from "@mantine/core";

export const DraggableText = () => {
  return (
    <DraggableComponent id="Text">
      <Text size="xs">Text</Text>
    </DraggableComponent>
  );
};
