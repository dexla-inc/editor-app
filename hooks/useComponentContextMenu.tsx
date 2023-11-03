import {
  IconBoxMargin,
  IconContainer,
  IconCopy,
  IconTrash,
} from "@tabler/icons-react";
import { useContextMenu } from "mantine-contextmenu";
import { useCallback } from "react";
import cloneDeep from "lodash.clonedeep";
import {
  addComponent,
  Component,
  getComponentIndex,
  getComponentParent,
  removeComponent,
  removeComponentFromParent,
} from "@/utils/editor";
import { useEditorStore } from "@/stores/editor";
import { structureMapper } from "@/utils/componentMapper";

const determinePasteTarget = (selectedId: string | undefined) => {
  if (!selectedId) return "content-wrapper";
  if (selectedId === "root") return "content-wrapper";
  return selectedId as string;
};

export const useComponentContextMenu = () => {
  const showContextMenu = useContextMenu();
  const editorTree = useEditorStore((state) => state.tree);
  const editorTheme = useEditorStore((state) => state.theme);
  const setEditorTree = useEditorStore((state) => state.setTree);
  const clearSelection = useEditorStore((state) => state.clearSelection);
  const setSelectedComponentId = useEditorStore(
    (state) => state.setSelectedComponentId,
  );

  const wrapIn = useCallback(
    (component: Component, componentName: string) => {
      const container = structureMapper[componentName].structure({
        theme: editorTheme,
      });
      const parent = getComponentParent(editorTree.root, component?.id!);

      if (container.props && container.props.style) {
        container.props.style = {
          ...container.props.style,
          width: "auto",
          padding: "0px",
        };
      }
      const copy = cloneDeep(editorTree);
      const containerId = addComponent(
        copy.root,
        container,
        {
          id: parent?.id!,
          edge: "left",
        },
        getComponentIndex(parent!, component.id!),
      );

      addComponent(copy.root, component, {
        id: containerId,
        edge: "left",
      });

      removeComponentFromParent(copy.root, component.id!, parent?.id!);
      setEditorTree(copy, {
        action: `Wrapped ${component.name} with a Container`,
      });
    },
    [editorTheme, editorTree, setEditorTree],
  );

  const deleteComponent = useCallback(
    (component: Component) => {
      if (
        component.id &&
        component.id !== "root" &&
        component.id !== "content-wrapper"
      ) {
        const copy = cloneDeep(editorTree);
        removeComponent(copy.root, component.id);
        setEditorTree(copy, { action: `Removed ${component?.name}` });
        clearSelection();
      }
    },
    [clearSelection, editorTree, setEditorTree],
  );

  const duplicateComponent = useCallback(
    async (component: Component) => {
      const copy = cloneDeep(editorTree);

      const targetId = determinePasteTarget(component?.id);
      const parentComponent = getComponentParent(copy.root, targetId);

      const newSelectedId = addComponent(
        copy.root,
        component,
        {
          id: parentComponent!.id as string,
          edge: "right",
        },
        getComponentIndex(parentComponent!, component?.id!) + 1,
      );

      await setEditorTree(copy, { action: `Pasted ${component.name}` });
      setSelectedComponentId(newSelectedId);
    },
    [editorTree, setSelectedComponentId, setEditorTree],
  );

  return (component: Component) =>
    showContextMenu([
      {
        key: "wrapIn",
        icon: <IconBoxMargin size={16} />,
        title: "Wrap in",
        items: [
          {
            key: "container",
            icon: <IconContainer size={16} />,
            title: "Container",
            onClick: () => wrapIn(component, "Container"),
          },
        ],
      },
      {
        key: "copy",
        icon: <IconCopy size={16} />,
        title: "Duplicate",
        onClick: () => duplicateComponent(component),
      },
      {
        key: "delete",
        icon: <IconTrash size={16} />,
        color: "red",
        title: "Delete",
        onClick: () => deleteComponent(component),
      },
    ]);
};
