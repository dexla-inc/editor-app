import { ActionIconDefault } from "@/components/ActionIconDefault";
import { useEditorTreeStore } from "@/stores/editorTree";
import { emptyEditorAttrsTree, emptyEditorTree } from "@/utils/common";
import { EditorTreeCopy } from "@/utils/editor";
import cloneDeep from "lodash.clonedeep";
import { nanoid } from "nanoid";

export const AddGridButton = () => {
  const setEditorTree = useEditorTreeStore((state) => state.setTree);

  const addGrid = () => {
    const editorTree = useEditorTreeStore.getState().tree;
    const copy = cloneDeep(editorTree);
    copy.root.children = (copy.root.children ?? [])
      .map((child) => {
        if (child.id !== "content-wrapper") return child;

        child.children![0].id = "old-main-content";

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
