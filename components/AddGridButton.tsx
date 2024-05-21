import { ActionIconDefault } from "@/components/ActionIconDefault";
import { useEditorTreeStore } from "@/stores/editorTree";
import { cloneObject, emptyEditorAttrsTree } from "@/utils/common";
import { EditorTreeCopy } from "@/utils/editor";
import { nanoid } from "nanoid";
import { memo } from "react";

const AddGridButtonComponent = () => {
  const addGrid = () => {
    const setEditorTree = useEditorTreeStore.getState().setTree;
    const editorTree = useEditorTreeStore.getState().tree;
    const copy = cloneObject(editorTree);
    copy.root.children = (copy.root.children ?? [])
      .map((child) => {
        if (child.id !== "content-wrapper") return child;

        const mainContentIndex = child.children![0].name == "Navbar" ? 1 : 0;

        child.children![mainContentIndex].id = "old-main-content" + nanoid();

        return {
          ...child,
          id: nanoid(),
          description: "Old Body",
        };
      })
      .concat(emptyEditorAttrsTree.root.children[0]);

    copy.root.children.reverse();
    setEditorTree(copy as EditorTreeCopy);
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

export const AddGridButton = memo(AddGridButtonComponent);
