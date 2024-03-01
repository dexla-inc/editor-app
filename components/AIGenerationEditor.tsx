import { PageResponse } from "@/requests/pages/types";
import { MantineThemeExtended, useEditorStore } from "@/stores/editor";
import {
  Component,
  DropTarget,
  EditorTree,
  addComponent,
  getComponentBeingAddedId,
  getNewComponent,
  ComponentTree,
} from "@/utils/editor";
import cloneDeep from "lodash.clonedeep";
import { MutableRefObject } from "react";

type Props = {
  componentBeingAddedId: MutableRefObject<string | undefined>;
  theme: MantineThemeExtended;
  updateTreeComponentChildren: (
    componentId: string,
    children: ComponentTree[],
  ) => void;
  setTree: (
    tree: EditorTree,
    options?: { onLoad?: boolean; action?: string },
  ) => void;
  pages: PageResponse[];
  tree: EditorTree;
  dropTarget: DropTarget;
};

export const createComponentEditorHandler = ({
  componentBeingAddedId,
  theme,
  updateTreeComponentChildren,
  setTree,
  pages,
  tree,
  dropTarget,
}: Props) => {
  return function (components: Component[]) {
    const newComponentTree = getNewComponent(components, theme, pages);
    const newComponents =
      useEditorStore.getState().componentMutableAttrs[newComponentTree?.id!];
    const id = getComponentBeingAddedId();

    if (!id) {
      const copy = cloneDeep(tree);
      // TODO: get this back
      // addComponent(copy.root, newComponents, dropTarget);
      // setTree(copy, { action: `Added ${newComponents.name}` });
    } else {
      componentBeingAddedId.current = id;
      updateTreeComponentChildren(id, newComponents.children!);
    }
  };
};
