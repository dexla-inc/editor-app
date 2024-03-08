import { useContextMenu } from "@/contexts/ContextMenuProvider";
import { useEditorStore } from "@/stores/editor";
import { useThemeStore } from "@/stores/theme";
import { useUserConfigStore } from "@/stores/userConfig";
import { copyToClipboard } from "@/utils/clipboard";
import { structureMapper } from "@/utils/componentMapper";
import { NAVBAR_WIDTH } from "@/utils/config";
import {
  Component,
  EditorTreeCopy,
  addComponent,
  debouncedTreeComponentAttrsUpdate,
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
  IconForms,
  IconTrash,
} from "@tabler/icons-react";
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
  const editorTheme = useThemeStore((state) => state.theme);
  const copiedProperties = useEditorStore((state) => state.copiedProperties);
  const setEditorTree = useEditorStore((state) => state.setTree);
  const clearSelection = useEditorStore((state) => state.clearSelection);
  const setCopiedComponent = useEditorStore(
    (state) => state.setCopiedComponent,
  );
  const setCopiedProperties = useEditorStore(
    (state) => state.setCopiedProperties,
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
      const editorTree = useEditorStore.getState().tree as EditorTreeCopy;
      const parent = getComponentParent(editorTree.root, component?.id!);

      if (container.props && container.props.style) {
        container.props.style = {
          ...container.props.style,
          width: "auto",
          padding: "0px",
        };
      }
      const containerId = addComponent(
        editorTree.root,
        container,
        {
          id: parent?.id!,
          edge: "left",
        },
        getComponentIndex(parent!, component.id!),
      );

      addComponent(editorTree.root, component, {
        id: containerId,
        edge: "left",
      });

      removeComponentFromParent(editorTree.root, component, parent?.id!);
      setEditorTree(editorTree, {
        action: `Wrapped ${component.name} with a Container`,
      });
      setTimeout(() => {
        setSelectedComponentIds(() => [containerId]);
      }, 100);
    },
    [editorTheme, setEditorTree, setSelectedComponentIds],
  );

  const deleteComponent = useCallback(
    (component: Component) => {
      if (
        component.id &&
        component.id !== "root" &&
        component.id !== "main-content" &&
        component.id !== "content-wrapper"
      ) {
        const editorTree = useEditorStore.getState().tree as EditorTreeCopy;
        removeComponent(editorTree.root, component.id);
        setEditorTree(editorTree, { action: `Removed ${component?.name}` });
        clearSelection();
      }
    },
    [clearSelection, setEditorTree],
  );

  const duplicateComponent = useCallback(
    async (component: Component) => {
      const editorTree = useEditorStore.getState().tree as EditorTreeCopy;
      const componentId = component?.id!;
      const componentName = component.name!;
      const targetId = determinePasteTarget(componentId);
      const parentComponent = getComponentParent(editorTree.root, targetId);

      const newSelectedId = addComponent(
        editorTree.root,
        component,
        {
          id: parentComponent!.id as string,
          edge: "bottom",
        },
        getComponentIndex(parentComponent!, componentId) + 1,
        true,
      );

      setEditorTree(editorTree, { action: `Pasted ${componentName}` });
      setSelectedComponentIds(() => [newSelectedId]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setEditorTree],
  );

  const copyComponent = useCallback(
    (component: Component) => {
      const copiedComponent =
        useEditorStore.getState().componentMutableAttrs[component.id!];
      setCopiedComponent(copiedComponent);
      copyToClipboard(copiedComponent);
    },
    [setCopiedComponent],
  );

  const copyProperties = useCallback(
    (component: Component) => {
      const targetComponent =
        useEditorStore.getState().componentMutableAttrs[component.id!];
      setCopiedProperties({
        componentName: targetComponent.name,
        componentProps: targetComponent.props!,
        componentStates: targetComponent.states!,
      });
    },
    [setCopiedProperties],
  );

  const pasteProperties = useCallback(
    (component: Component) => {
      if (!copiedProperties) return;
      const isTargetNameSame =
        component.name === copiedProperties.componentName;
      if (!isTargetNameSame) return;
      debouncedTreeComponentAttrsUpdate({
        componentIds: [component.id!],
        attrs: {
          props: omit(copiedProperties.componentProps, blackList),
          states: copiedProperties.componentStates!,
        },
      });
    },
    [copiedProperties],
  );

  return {
    forceDestroyContextMenu: destroy,
    componentContextMenu: (
      component: Component,
      clickX?: number,
      clickY?: number,
    ) =>
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
              {
                key: "form",
                icon: <IconForms size={16} />,
                title: "Form",
                onClick: () => wrapIn(component, "Form"),
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
            ...(clickX !== undefined && {
              root: { marginLeft: NAVBAR_WIDTH },
            }),
          },
        },
      ),
  };
};

export const useComponentContextEventHandler = (
  component: Component,
  componentContextMenu: (
    component: Component,
    x?: number | undefined,
    y?: number | undefined,
  ) => MouseEventHandler,
) => {
  return useCallback(
    (event: any) => {
      if (event.shiftKey || event.ctrlKey || event.metaKey) {
        return;
      }

      event.preventDefault();
      // Capture the click position
      const clickX = event.clientX;
      const clickY = event.clientY;

      componentContextMenu(component, clickX, clickY)(event);
    },
    [component, componentContextMenu],
  );
};
