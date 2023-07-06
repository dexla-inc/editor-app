import { Draggable } from "@/components/Draggable";
import { useEditorStore } from "@/stores/editor";
import { structureMapper } from "@/utils/componentMapper";
import { Text } from "@mantine/core";
import { useEffect, useState } from "react";

type Props = {
  id: string;
  text?: string;
  data?: any;
  icon?: JSX.Element;
};

export const DraggableComponent = ({ id, text, data, icon }: Props) => {
  const pages = useEditorStore((state) => state.pages);
  const theme = useEditorStore((state) => state.theme);
  const [draggableData, setDraggableData] = useState<any>(data);

  useEffect(() => {
    if (!data) {
      const component = structureMapper[id];
      setDraggableData(component.structure({ theme, pages }));
    } else {
      setDraggableData(data);
    }
  }, [data, id, pages, theme]);

  return (
    <Draggable id={id} data={draggableData} isDeletable={!!data} sx={{}}>
      {icon}
      <Text size="xs">{text ?? id}</Text>
    </Draggable>
  );
};
