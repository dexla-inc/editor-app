import { useEditorStore } from "@/stores/editor";
import { GRID_SIZE } from "@/utils/config";
import { Button } from "@mantine/core";
import cloneDeep from "lodash.clonedeep";
import { nanoid } from "nanoid";

const gridStructure = {
  id: "content-wrapper",
  name: "Grid",
  description: "Grid",
  props: {
    // isBeingAdded: true,
    bg: "white",
    m: 0,
    p: 0,
    gridSize: GRID_SIZE,
    style: {
      width: "100%",
      height: "auto",
      minHeight: "50px",
    },
  },
  children: [
    {
      id: nanoid(),
      name: "GridColumn",
      description: "GridColumn",
      props: {
        span: GRID_SIZE,
        bg: "white",
        style: {
          height: "auto",
          minHeight: "50px",
          border: "2px dotted #ddd",
        },
      },
    },
  ],
};

export const AddGridButton = () => {
  const editorTree = useEditorStore((state) => state.tree);
  const setEditorTree = useEditorStore((state) => state.setTree);

  const addGrid = () => {
    const copy = cloneDeep(editorTree);
    copy.root.children = (copy.root.children ?? [])
      .map((child) => {
        if (child.id !== "content-wrapper") return child;

        return {
          ...child,
          id: nanoid(),
          description: "Old Content Wrapper",
        };
      })
      .concat(gridStructure);

    copy.root.children.reverse();
    setEditorTree(copy);
  };

  return (
    <Button size="xs" onClick={addGrid}>
      Add Grid
    </Button>
  );
};
