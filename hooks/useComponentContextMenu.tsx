import {
  IconBoxMargin,
  IconClipboardCopy,
  IconClipboardData,
  IconClipboardPlus,
  IconContainer,
  IconCopy,
  IconTrash,
} from "@tabler/icons-react";
// import { useContextMenu } from "mantine-contextmenu";
import { useContextMenu } from "@/contexts/ContextMenuProvider";
import { ClipboardProps, useEditorStore } from "@/stores/editor";
import { useUserConfigStore } from "@/stores/userConfig";
import { structureMapper } from "@/utils/componentMapper";
import { NAVBAR_WIDTH } from "@/utils/config";
import {
  Component,
  addComponent,
  debouncedTreeUpdate,
  getComponentById,
  getComponentIndex,
  getComponentParent,
  removeComponent,
  removeComponentFromParent,
} from "@/utils/editor";
import cloneDeep from "lodash.clonedeep";
import { useCallback } from "react";

const determinePasteTarget = (selectedId: string | undefined) => {
  if (!selectedId) return "content-wrapper";
  if (selectedId === "root") return "content-wrapper";
  return selectedId as string;
};

const blackList = ["name", "value", "children"];

const filteredPropsToUpdate = (props: ClipboardProps["componentProps"]) => {
  const result = {} as ClipboardProps["componentProps"];
  Object.keys(props).forEach((key) => {
    if (!blackList.includes(key)) {
      result[key] = props[key];
    }
  });
  return result as ClipboardProps["componentProps"];
};

export const useComponentContextMenu = () => {
  const { showContextMenu, destroy } = useContextMenu();
  const editorTree = useEditorStore((state) => state.tree);
  const editorTheme = useEditorStore((state) => state.theme);
  const copiedProperties = useEditorStore((state) => state.copiedProperties);
  const isTabPinned = useUserConfigStore((state) => state.isTabPinned);

  const setEditorTree = useEditorStore((state) => state.setTree);
  const clearSelection = useEditorStore((state) => state.clearSelection);
  const setCopiedComponent = useEditorStore(
    (state) => state.setCopiedComponent,
  );
  const setCopiedProperties = useEditorStore(
    (state) => state.setCopiedProperties,
  );
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

  const copyComponent = useCallback(
    (component: Component) => {
      setCopiedComponent(getComponentById(editorTree.root, component.id!)!);
    },
    [setCopiedComponent, editorTree.root],
  );

  const copyProperties = useCallback(
    (component: Component) => {
      const targetComponent = getComponentById(editorTree.root, component.id!)!;
      setCopiedProperties({
        componentName: targetComponent.name,
        componentProps: targetComponent.props!,
      });
    },
    [setCopiedProperties, editorTree.root],
  );

  const pasteProperties = useCallback(
    (component: Component) => {
      if (!copiedProperties) return;
      const isTargetNameSame =
        component.name === copiedProperties.componentName;
      if (!isTargetNameSame) return;
      const filteredProps = filteredPropsToUpdate(
        copiedProperties.componentProps,
      );
      debouncedTreeUpdate(component.id!, filteredProps);
    },
    [copiedProperties],
  );

  return {
    forceDestroyContextMenu: destroy,
    componentContextMenu: (component: Component) =>
      showContextMenu(
        [
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
            key: "duplicate",
            icon: <IconCopy size={16} />,
            title: "Duplicate",
            onClick: () => duplicateComponent(component),
          },
          {
            key: "copy",
            icon: <IconClipboardCopy size={16} />,
            title: "Copy",
            onClick: () => copyComponent(component),
          },
          {
            key: "properties",
            icon: <IconClipboardData size={16} />,
            title: "Properties",
            items: [
              {
                key: "copy_properties",
                icon: <IconClipboardCopy size={16} />,
                title: "Copy Properties",
                onClick: () => copyProperties(component),
              },
              {
                key: "paste_properties",
                icon: <IconClipboardPlus size={16} />,
                title: "Paste Properties",
                onClick: () => pasteProperties(component),
              },
            ],
          },
          {
            key: "delete",
            icon: <IconTrash size={16} />,
            color: "red",
            title: "Delete",
            onClick: () => deleteComponent(component),
          },
        ],
        {
          styles: {
            ...(isTabPinned && { root: { marginLeft: NAVBAR_WIDTH } }),
          },
        },
      ),
  };
};
