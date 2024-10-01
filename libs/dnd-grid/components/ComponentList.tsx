import { useDnd } from "../hooks/useDnd";
import { componentTypes } from "../types/types";

const ComponentList = ({}) => {
  const { onDragStart, onDrag, onDragEnd } = useDnd();
  return (
    <div className="flex gap-4 mb-4 overflow-x-auto pb-2">
      {componentTypes.map((componentData) => (
        <div
          data-type={componentData.name}
          key={componentData.name}
          draggable
          // onDragStart={(e) => {
          //   e.dataTransfer.setData('text/plain', JSON.stringify({ type: componentData.type }));
          // }}
          onDragStart={onDragStart}
          onDrag={onDrag}
          onDragEnd={onDragEnd}
          className="p-2 border rounded bg-white cursor-move"
        >
          {componentData.description}
        </div>
      ))}
    </div>
  );
};

export default ComponentList;
