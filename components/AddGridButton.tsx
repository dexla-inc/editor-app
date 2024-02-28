import { ActionIconDefault } from "@/components/ActionIconDefault";
import { emptyEditorTree, useEditorStore } from "@/stores/editor";
import cloneDeep from "lodash.clonedeep";
import { nanoid } from "nanoid";

export const AddGridButton = () => {
  const setEditorTree = useEditorStore((state) => state.setTree);

  const addGrid = () => {
    const editorTree = useEditorStore.getState().tree;
    const copy = cloneDeep(editorTree);
    copy.root.children = (copy.root.children ?? [])
      .map((child) => {
        if (child.id !== "content-wrapper") return child;

        return {
          ...child,
          id: nanoid(),
          description: "Old Body",
        };
      })
      .concat(emptyEditorTree.root.children[0]);

    copy.root.children.reverse();
    // TODO: get this back
    // setEditorTree(copy);
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
