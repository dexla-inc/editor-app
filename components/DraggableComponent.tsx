import { Draggable } from "@/components/Draggable";
import { structureMapper } from "@/utils/componentMapper";
import { toSpaced } from "@/types/dashboardTypes";
import { Box, Text } from "@mantine/core";

type Props = {
  id: string;
  text?: string;
  data?: any;
  icon?: JSX.Element;
};

export const DraggableComponent = ({ id, text, data, icon }: Props) => {
  let dataCallback = () => {
    const component = structureMapper[id];
    return data ? data : component.structure({});
  };

  return (
    <Draggable id={id} data={dataCallback} isDeletable={!!data} sx={{}}>
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
