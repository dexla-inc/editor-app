import {
  IconArrowUp,
  IconSettings,
  IconPhone,
  IconSquare,
  IconLayout,
  IconTrash,
  IconHandMove,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useDndGridStore } from "@/libs/dnd-grid/stores/dndGridStore";
import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";

const ComponentToolbox = () => {
  const components = useEditorTreeStore((state) => state.tree.root);
  const isInteracting = useDndGridStore((state) => state.isInteracting);
  const id = useEditorTreeStore(
    (state) => state.selectedComponentIds?.[0] ?? "",
  );
  const iframeWindow = useEditorStore((state) => state.iframeWindow);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const leftIcon = { Icon: IconArrowUp, label: "Button" };
  const rightIcons = [
    { Icon: IconSettings, label: "Settings" },
    { Icon: IconPhone, label: "Mobile" },
    { Icon: IconSquare, label: "Square" },
    { Icon: IconLayout, label: "Layers" },
    { Icon: IconTrash, label: "Trash" },
  ];

  useEffect(() => {
    if (id) {
      const element = iframeWindow?.document.getElementById(id);
      if (element) {
        const rect = element.getBoundingClientRect();
        setPosition({
          top: rect.top,
          left: rect.left,
        });
      }
    }
  }, [id, components, iframeWindow]);

  if (!id || isInteracting) {
    return null;
  }

  return (
    <div
      id="component-toolbox-header"
      style={{
        backgroundColor: "#3b82f6",
        color: "white",
        padding: "2px",
        borderRadius: "6px",
        display: "flex",
        alignItems: "center",
        position: "absolute",
        zIndex: 200,
        top: `${position.top - 30}px`,
        left: `${position.left}px`,
      }}
    >
      <IconHandMove size={12} style={{ marginRight: "2px" }} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "20px",
          height: "20px",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "")}
        title={leftIcon.label}
      >
        <leftIcon.Icon size={14} />
      </div>
      <div
        style={{
          fontWeight: 600,
          fontSize: "12px",
          marginLeft: "2px",
          marginRight: "2px",
        }}
      >
        {id}
      </div>
      {rightIcons.map(({ Icon, label }) => (
        <div
          key={label}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "20px",
            height: "20px",
            borderRadius: "4px",
            cursor: "pointer",
            marginLeft: "2px",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#2563eb")
          }
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "")}
          title={label}
        >
          <Icon size={14} />
        </div>
      ))}
    </div>
  );
};

export default ComponentToolbox;
