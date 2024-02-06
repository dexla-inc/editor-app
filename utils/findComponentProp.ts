import { useEditorStore } from "@/stores/editor";
import { getComponentById } from "@/utils/editor";

export const findComponentProp = (id: string) => {
  const editorTree = useEditorStore.getState().tree;
  const component = getComponentById(editorTree.root, id);
  return (
    ["value", "name", "children"].find(
      (prop) => component?.props![prop] !== undefined,
    ) ?? ""
  );
};
