import { Draggable } from "@/components/Draggable";
import { structureMapper } from "@/utils/componentMapper";
import { Text } from "@mantine/core";
import { useEffect, useState } from "react";

type Props = {
  id: string;
  text?: string;
  data?: any;
};

export const DraggableComponent = ({ id, text, data }: Props) => {
  const [draggableData, setDraggableData] = useState<any>(data);

  useEffect(() => {
    if (!data) {
      const component = structureMapper[id];
      setDraggableData(component.structure({}));
    } else {
      setDraggableData(data);
    }
  }, [data, id]);

  return (
    <Draggable id={id} data={draggableData} isDeletable={!!data}>
      <Text size="xs">{text ?? id}</Text>
    </Draggable>
  );
};
