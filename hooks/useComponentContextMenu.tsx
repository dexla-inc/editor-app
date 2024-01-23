import { useContextMenu } from "@/contexts/ContextMenuProvider";
import { useEditorStore } from "@/stores/editor";
import { useUserConfigStore } from "@/stores/userConfig";
import { copyToClipboard } from "@/utils/clipboard";
import { structureMapper } from "@/utils/componentMapper";
import { NAVBAR_WIDTH } from "@/utils/config";
import {
  Component,
  addComponent,
  debouncedTreeUpdate,
  debouncedTreeUpdateStates,
  getComponentById,
  getComponentIndex,
  getComponentParent,
  removeComponent,
  removeComponentFromParent,
} from "@/utils/editor";
import {
  IconBoxMargin,
  IconBoxModel,
  IconClipboardCopy,
  IconClipboardData,
  IconClipboardPlus,
  IconContainer,
  IconCopy,
  IconTrash,
} from "@tabler/icons-react";
import cloneDeep from "lodash.clonedeep";
import { omit } from "next/dist/shared/lib/router/utils/omit";
import { MouseEventHandler, useCallback } from "react";

const determinePasteTarget = (selectedId: string | undefined) => {
  if (!selectedId) return "content-wrapper";
  if (selectedId === "root") return "content-wrapper";
  return selectedId as string;
};

const blackList = ["name", "value", "children"];

export const useComponentContextMenu = () => {
  const { showContextMenu, destroy } = useContextMenu();

  const editorTree = useEditorStore((state) => state.tree);
  const editorTheme = useEditorStore((state) => state.theme);
  const copiedProperties = useEditorStore((state) => state.copiedProperties);
  const isPageStructure = useEditorStore((state) => state.isPageStructure);
  const setEditorTree = useEditorStore((state) => state.setTree);
  const clearSelection = useEditorStore((state) => state.clearSelection);
  const clearSelections = useEditorStore((state) => state.clearSelections);
  const setCopiedComponent = useEditorStore(
    (state) => state.setCopiedComponent,
  );
  const setCopiedProperties = useEditorStore(
    (state) => state.setCopiedProperties,
  );
  const setSelectedComponentId = useEditorStore(
    (state) => state.setSelectedComponentId,
  );
  const setSelectedComponentIds = useEditorStore(
    (state) => state.setSelectedComponentIds,
  );

  const isTabPinned = useUserConfigStore((state) => state.isTabPinned);

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
      setTimeout(() => {
        setSelectedComponentId(containerId);
        setSelectedComponentIds(() => [containerId]);
      }, 100);
    },
    [
      editorTheme,
      editorTree,
      setEditorTree,
      setSelectedComponentId,
      setSelectedComponentIds,
    ],
  );

  const deleteComponent = useCallback(
    (component: Component) => {
      if (
        component.id &&
        component.id !== "root" &&
        component.id !== "main-content" &&
        component.id !== "content-wrapper"
      ) {
        const copy = cloneDeep(editorTree);
        removeComponent(copy.root, component.id);
        setEditorTree(copy, { action: `Removed ${component?.name}` });
        clearSelection();
        clearSelections();
      }
    },
    [clearSelection, clearSelections, editorTree, setEditorTree],
  );

  const duplicateComponent = useCallback(
    async (component: Component) => {
      const copy = cloneDeep(editorTree);
      const componentId = component?.id!;
      const componentName = component.name!;
      const targetId = determinePasteTarget(componentId);
      const parentComponent = getComponentParent(copy.root, targetId);

      const newSelectedId = addComponent(
        copy.root,
        component,
        {
          id: parentComponent!.id as string,
          edge: "bottom",
        },
        getComponentIndex(parentComponent!, componentId) + 1,
      );

      setEditorTree(copy, { action: `Pasted ${componentName}` });
      setSelectedComponentId(newSelectedId);
      setSelectedComponentIds(() => [newSelectedId]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editorTree, setSelectedComponentId, setEditorTree],
  );

  const copyComponent = useCallback(
    (component: Component) => {
      const copiedComponent = getComponentById(editorTree.root, component.id!)!;
      setCopiedComponent(copiedComponent);
      copyToClipboard(copiedComponent);
    },
    [setCopiedComponent, editorTree.root],
  );

  const copyProperties = useCallback(
    (component: Component) => {
      const targetComponent = getComponentById(editorTree.root, component.id!)!;
      setCopiedProperties({
        componentName: targetComponent.name,
        componentProps: targetComponent.props!,
        componentStates: targetComponent.states!,
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
      debouncedTreeUpdate(
        component.id!,
        omit(copiedProperties.componentProps, blackList),
      );
      debouncedTreeUpdateStates(
        component.id!,
        copiedProperties.componentStates!,
      );
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
              {
                key: "card",
                icon: <IconBoxModel size={16} />,
                title: "Card",
                onClick: () => wrapIn(component, "Card"),
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
                title: "Copy",
                onClick: () => copyProperties(component),
              },
              {
                key: "paste_properties",
                icon: <IconClipboardPlus size={16} />,
                title: "Paste",
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
            ...(isTabPinned &&
              !isPageStructure && { root: { marginLeft: NAVBAR_WIDTH } }),
          },
        },
      ),
  };
};

export const useComponentContextEventHandler = (
  component: Component,
  componentContextMenu: (component: Component) => MouseEventHandler,
) => {
  return useCallback(
    (event: any) => {
      if (event.shiftKey || event.ctrlKey || event.metaKey) {
        return;
      }

      event.preventDefault();
      componentContextMenu(component)(event);
    },
    [component, componentContextMenu],
  );
};
