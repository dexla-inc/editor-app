import { ActionIconDefault } from "@/components/ActionIconDefault";
import { emptyEditorTree, useEditorStore } from "@/stores/editor";
import { EditorTreeCopy } from "@/utils/editor";
import { nanoid } from "nanoid";

export const AddGridButton = () => {
  const setEditorTree = useEditorStore((state) => state.setTree);

  const addGrid = () => {
    const editorTree = useEditorStore.getState().tree;
    editorTree.root.children = (editorTree.root.children ?? [])
      .map((child) => {
        if (child.id !== "content-wrapper") return child;

        return {
          ...child,
          id: nanoid(),
          description: "Old Body",
        };
      })
      .concat(emptyEditorTree.root.children[0]);

    editorTree.root.children.reverse();
    setEditorTree(editorTree as EditorTreeCopy);
  };

  return (
    <ActionIconDefault
      iconName="IconLayoutGridAdd"
      tooltip="Add Grid"
      onClick={addGrid}
      color="teal"
    />
  );
};
