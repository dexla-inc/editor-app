import { Draggable } from "@/components/Draggable";
import { Text } from "@mantine/core";

type Props = {
  id: string;
};

export const DraggableComponent = ({ id }: Props) => {
  return (
    <Draggable id={id}>
      <Text size="xs">{id}</Text>
    </Draggable>
  );
};
