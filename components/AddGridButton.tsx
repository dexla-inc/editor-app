import { useEditorStore } from "@/stores/editor";
import { GRAY_OUTLINE } from "@/utils/branding";
import { GRID_SIZE } from "@/utils/config";
import { Button } from "@mantine/core";
import cloneDeep from "lodash.clonedeep";
import { nanoid } from "nanoid";

const gridStructure = {
  id: "content-wrapper",
  name: "Grid",
  description: "Grid",
  props: {
    gridSize: GRID_SIZE,
    gap: 0,
    style: {
      minHeight: "50px",
    },
  },
  children: [
    {
      id: nanoid(),
      name: "GridColumn",
      description: "Main Content",
      props: {
        span: GRID_SIZE,
        style: {
          alignSelf: "start",
          minHeight: "50px",
          outline: GRAY_OUTLINE,
          outlineOffset: "-2px",
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
          description: "Old Body",
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
