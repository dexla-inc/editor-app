import { useDnd } from "../hooks/useDnd";
import { componentTypes } from "../types/types";

const ComponentList = ({}) => {
  const { onDragStart, onDrag, onDragEnd } = useDnd();
  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        marginBottom: "1rem",
        overflowX: "auto",
        paddingBottom: "0.5rem",
      }}
    >
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
          style={{
            padding: "0.5rem",
            border: "1px solid",
            borderRadius: "0.25rem",
            backgroundColor: "white",
            cursor: "move",
          }}
        >
          {componentData.description}
        </div>
      ))}
    </div>
  );
};

export default ComponentList;
