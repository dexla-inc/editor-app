import { DraggableComponent } from "@/components/DraggableComponent";
import { Text } from "@mantine/core";

export const DraggableAppBar = () => {
  return (
    <DraggableComponent id="AppBar">
      <Text size="xs">App Bar</Text>
    </DraggableComponent>
  );
};
