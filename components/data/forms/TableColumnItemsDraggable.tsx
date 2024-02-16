import { ICON_SIZE } from "@/utils/config";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Flex, Stack, Switch, TextInput, Tooltip } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { IconGripVertical } from "@tabler/icons-react";
import { forwardRef } from "react";

type TableColumnItemProps = {
  value: string;
  dragHandleProps: any;
} & React.RefAttributes<HTMLDivElement>;

const TableColumnItem = forwardRef<HTMLDivElement, TableColumnItemProps>(
  ({ value, dragHandleProps, ...props }, ref) => (
    <Flex align="center" justify="center" gap="xs" ref={ref} {...props}>
      <Tooltip label="Reorder">
        <Flex align="center" style={{ cursor: "pointer" }} {...dragHandleProps}>
          <IconGripVertical
            style={{ width: ICON_SIZE, height: ICON_SIZE }}
            stroke={1.5}
          />
        </Flex>
      </Tooltip>
      <Switch />
      <Tooltip label={value}>
        <TextInput value={value} readOnly />
      </Tooltip>
    </Flex>
  ),
);

TableColumnItem.displayName = "TableColumnItem";

export type TableColumnItemsDraggableProps = {
  selectableObjectKeys: string[];
};

export function TableColumnItemsDraggable({
  selectableObjectKeys,
}: TableColumnItemsDraggableProps) {
  const [state, handlers] = useListState(selectableObjectKeys);

  return (
    <DragDropContext
      onDragEnd={({ destination, source }) => {
        if (!destination) return;
        handlers.reorder({ from: source.index, to: destination.index });
      }}
    >
      <Droppable droppableId="droppable-column-items" direction="vertical">
        {(provided) => (
          <Flex
            align="center"
            justify="center"
            gap="xs"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <Stack spacing="xs">
              {state.map((item, index) => (
                <Draggable key={item} draggableId={item} index={index}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps}>
                      <TableColumnItem
                        value={item}
                        dragHandleProps={provided.dragHandleProps}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Stack>
          </Flex>
        )}
      </Droppable>
    </DragDropContext>
  );
}
