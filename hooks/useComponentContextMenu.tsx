import { useContextMenu } from "@/contexts/ContextMenuProvider";
import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useThemeStore } from "@/stores/theme";
import { copyToClipboard } from "@/utils/clipboard";
import { structureMapper } from "@/utils/componentMapper";
import { NAVBAR_WIDTH } from "@/utils/config";
import {
  Component,
  ComponentStructure,
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
import { getComponentTreeById } from "@/utils/editor";

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
  const setEditorTree = useEditorTreeStore((state) => state.setTree);
  const isPreviewMode = useEditorTreeStore((state) => state.isPreviewMode);
  const setCopiedComponent = useEditorStore(
    (state) => state.setCopiedComponent,
  );
  const setCopiedProperties = useEditorStore(
    (state) => state.setCopiedProperties,
  );
  const setSelectedComponentIds = useEditorTreeStore(
    (state) => state.setSelectedComponentIds,
  );
  const deleteComponentMutableAttr = useEditorTreeStore(
    (state) => state.deleteComponentMutableAttr,
  );

  const wrapIn = useCallback(
    (component: Component, componentName: string) => {
      const container = structureMapper[componentName].structure({
        theme: editorTheme,
      }) as ComponentStructure;

      const editorTree = useEditorTreeStore.getState().tree as EditorTreeCopy;
      const parent = getComponentParent(editorTree.root, component?.id!);

      const componentToBeWrapped = getComponentTreeById(
        editorTree.root,
        component.id!,
      )! as ComponentStructure;

      if (container.props && container.props.style) {
        container.props.style = {
          ...container.props.style,
          width: "auto",
          padding: "0px",
        };
        container.children = [componentToBeWrapped];
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
        const editorTree = useEditorTreeStore.getState().tree as EditorTreeCopy;
        removeComponent(editorTree.root, component.id);
        setEditorTree(editorTree, { action: `Removed ${component?.name}` });
        deleteComponentMutableAttr(component.id);
      }
    },
    [deleteComponentMutableAttr, setEditorTree],
  );

  const duplicateComponent = useCallback(
    async (component: Component) => {
      const editorTree = useEditorTreeStore.getState().tree as EditorTreeCopy;
      const componentId = component.id as string;

      const componentToCopy = getComponentTreeById(
        editorTree.root,
        componentId,
      )!;

      const componentName = component.name;
      const targetId = determinePasteTarget(componentId);
      const parentComponent = getComponentParent(editorTree.root, targetId);

      const newSelectedId = addComponent(
        editorTree.root,
        componentToCopy,
        {
          id: parentComponent!.id as string,
          edge: "bottom",
        },
        getComponentIndex(parentComponent!, componentId) + 1,
        true,
        true,
      );

      setEditorTree(editorTree, { action: `Pasted ${componentName}` });
      setSelectedComponentIds(() => [newSelectedId]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isPreviewMode, setEditorTree],
  );

  const copyComponent = useCallback(
    (component: Component) => {
      const editorTree = useEditorTreeStore.getState().tree as EditorTreeCopy;

      const componentToCopy = getComponentTreeById(
        editorTree.root,
        component.id!,
      )!;
      if (!isPreviewMode) {
        setCopiedComponent(componentToCopy);
        copyToClipboard(componentToCopy);
      }
    },
    [isPreviewMode, setCopiedComponent],
  );

  const copyProperties = useCallback(
    (component: Component) => {
      const targetComponent =
        useEditorTreeStore.getState().componentMutableAttrs[component.id!];
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
      // TODO: Duplicate doesn't copy children
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
