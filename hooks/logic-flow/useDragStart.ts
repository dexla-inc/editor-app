type NodeDragData = {
  event: any;
  type: string;
  id: string;
  data: object;
};

export const useDragStart = () => {
  const onDragStart = ({ event, ...rest }: NodeDragData) => {
    event.dataTransfer.setData("application/reactflow", JSON.stringify(rest));
    event.dataTransfer.effectAllowed = "move";
  };

  return onDragStart;
};
