import { useEditorStore } from "@/stores/editor";
import { useDnd } from "../hooks/useDnd";

const componentTypes = ["Button", "Container", "Text", "Alert", "Title"];

const ComponentList = () => {
  const { onDragStart, onDrag, onDragEnd } = useDnd("ComponentList");

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
      {componentTypes.map((name) => (
        <div
          data-type={name}
          key={name}
          draggable
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
          {name}
        </div>
      ))}
    </div>
  );
};

export default ComponentList;
