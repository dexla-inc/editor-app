import {
  IconArrowUp,
  IconSettings,
  IconTrash,
  IconHandMove,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useDndGridStore } from "@/libs/dnd-grid/stores/dndGridStore";
import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";
import { Group } from "@mantine/core";
import { EditorTreeCopy, removeComponent } from "@/utils/editor";
import { useShallow } from "zustand/react/shallow";
import { selectedComponentIdSelector } from "@/utils/componentSelectors";
import { pick } from "next/dist/lib/pick";

const ComponentToolbox = () => {
  const components = useEditorTreeStore((state) => state.tree.root);
  const isInteracting = useDndGridStore((state) => state.isInteracting);
  const id = useEditorTreeStore(
    (state) => state.selectedComponentIds?.[0] ?? "",
  );
  const iframeWindow = useEditorStore((state) => state.iframeWindow);
  const setEditorTree = useEditorTreeStore((state) => state.setTree);
  const setSelectedComponentIds = useEditorTreeStore(
    (state) => state.setSelectedComponentIds,
  );
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const leftIcon = { Icon: IconArrowUp, label: "Button" };

  const rightIcons = [
    {
      Icon: IconSettings,
      label: "Settings",
      onClick: () => {
        console.log("Settings clicked for component:", component.id);
      },
    },
    {
      Icon: IconTrash,
      label: "Delete",
      onClick: () => {
        if (component.id === "main-grid") return;

        const editorTree = useEditorTreeStore.getState().tree as EditorTreeCopy;
        removeComponent(editorTree.root, component.id!);
        setSelectedComponentIds(() => []);
        setEditorTree(editorTree, {
          action: `Removed ${component?.name}`,
        });
      },
    },
  ];

  const component = useEditorTreeStore(
    useShallow((state) => {
      const selectedComponentId = selectedComponentIdSelector(state);

      return {
        ...(pick(state.componentMutableAttrs[selectedComponentId!] ?? {}, [
          "name",
          "description",
          "fixedPosition",
        ]) || {}),
        id: state.selectedComponentIds?.at(-1),
      };
    }),
  );

  useEffect(() => {
    if (id) {
      const element = iframeWindow?.document.querySelectorAll(
        `[aria-describedby^="${id}"], [id="${id}"], [data-id="${id}"]`,
      )[0];
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
        zIndex: 1000,
        top: `${position.top - 55}px`,
        left: `${position.left - 10}px`,
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
        {id} - {component.description}
      </div>
      {rightIcons.map(({ Icon, label, onClick }) => (
        <Group
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
          onClick={onClick}
        >
          <Icon size={14} />
        </Group>
      ))}
    </div>
  );
};

export default ComponentToolbox;
