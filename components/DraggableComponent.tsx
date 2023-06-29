import { Draggable } from "@/components/Draggable";
import { useEditorStore } from "@/stores/editor";
import { structureMapper } from "@/utils/componentMapper";
import { Text, useMantineTheme } from "@mantine/core";
import { useEffect, useState } from "react";

type Props = {
  id: string;
  text?: string;
  data?: any;
};

export const DraggableComponent = ({ id, text, data }: Props) => {
  const theme = useEditorStore((state) => state.theme);
  const [draggableData, setDraggableData] = useState<any>(data);

  useEffect(() => {
    if (!data) {
      const component = structureMapper[id];
      setDraggableData(component.structure({ theme }));
    } else {
      setDraggableData(data);
    }
  }, [data, id, theme]);

  return (
    <Draggable id={id} data={draggableData} isDeletable={!!data}>
      <Text size="xs">{text ?? id}</Text>
    </Draggable>
  );
};
