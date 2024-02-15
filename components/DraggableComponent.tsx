import { Draggable } from "@/components/Draggable";
import { useEditorStore } from "@/stores/editor";
import { structureMapper } from "@/utils/componentMapper";
import { toSpaced } from "@/utils/dashboardTypes";
import { Box, Text } from "@mantine/core";
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
      const _data = component.structure({ theme, pages });
      setDraggableData(_data);
    } else {
      setDraggableData(data);
    }
  }, [data, id, pages, theme]);

  return (
    <Draggable id={id} data={draggableData} isDeletable={!!data} sx={{}}>
      <Box
        h={60}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 0,
        }}
      >
        {icon}
        <Text size="xs">{toSpaced(text ?? id)}</Text>
      </Box>
    </Draggable>
  );
};
