import { Draggable } from "@/libs/dnd-grid/components/Draggable";
import { structureMapper } from "@/libs/dnd-grid/utils/componentMapper";
import { toSpaced } from "@/types/dashboardTypes";
import { Box, Text } from "@mantine/core";

type Props = {
  id: string;
  text?: string;
  data?: any;
  icon?: JSX.Element;
};

export const DraggableComponent = ({ id, text, data, icon }: Props) => {
  const draggableData = data || structureMapper[id]?.structure({});

  return (
    <Draggable id={id} data={draggableData} isDeletable={!!data}>
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
