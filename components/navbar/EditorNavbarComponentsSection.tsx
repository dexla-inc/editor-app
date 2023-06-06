import { Stack } from "@mantine/core";
import { componentMapper } from "@/utils/componentMapper";

export const EditorNavbarComponentsSection = () => {
  const components = Object.keys(componentMapper).reduce((draggables, key) => {
    const draggable = componentMapper[key]?.Draggable;

    return draggable ? draggables.concat(draggable) : draggables;
  }, []);

  return (
    <Stack>
      {components.map((draggableComponent: any) => {
        return draggableComponent();
      })}
    </Stack>
  );
};
