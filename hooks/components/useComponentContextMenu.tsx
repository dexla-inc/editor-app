import { useContextMenu } from "@/contexts/ContextMenuProvider";
import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useThemeStore } from "@/stores/theme";
import { copyToClipboard, pasteFromClipboard } from "@/utils/clipboard";
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
  IconClipboardText,
  IconContainer,
  IconCopy,
  IconForms,
  IconRefresh,
  IconTrash,
} from "@tabler/icons-react";
import { omit } from "next/dist/shared/lib/router/utils/omit";
import { useCallback } from "react";
import { getComponentTreeById } from "@/utils/editor";
import { cloneObject } from "@/utils/common";
import {
  isEditorModeSelector,
  selectedComponentIdSelector,
} from "@/utils/componentSelectors";

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
  const updateTreeComponentAttrs = useEditorTreeStore(
    (state) => state.updateTreeComponentAttrs,
  );
  const copiedComponent = useEditorStore((state) => state.copiedComponent);
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

  const resetComponent = useCallback(
    async (component: Component) => {
      if (component.id && component.id !== "root") {
        const structure = structureMapper[component.name].structure({
          theme: editorTheme,
        }) as ComponentStructure;

        const targetComponent =
          useEditorTreeStore.getState().componentMutableAttrs[component.id!];

        updateTreeComponentAttrs({
          componentIds: [component.id],
          attrs: {
            ...targetComponent,
            props: structure.props,
            states: structure.states ?? {},
            onLoad: structure.onLoad ?? {},
            actions: structure.actions ?? [],
          },
          replaceAll: true,
        });
      }
    },
    [editorTheme, updateTreeComponentAttrs],
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
    [setEditorTree],
  );

  const copyComponent = useCallback(
    (component: Component) => {
      const isPreviewMode = useEditorTreeStore.getState().isPreviewMode;
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
    [setCopiedComponent],
  );

  const pasteComponent = useCallback(async () => {
    const isPreviewMode = useEditorTreeStore.getState().isPreviewMode;
    const clipboardContent = pasteFromClipboard() as ComponentStructure;
    const componentToPaste =
      (clipboardContent as typeof copiedComponent as ComponentStructure) ||
      (copiedComponent as ComponentStructure);
    if (!componentToPaste || isPreviewMode) {
      return;
    }

    const selectedComponentId = selectedComponentIdSelector(
      useEditorTreeStore.getState(),
    );

    if (!selectedComponentId || selectedComponentId === "root")
      return "content-wrapper";

    const editorTree = useEditorTreeStore.getState().tree as EditorTreeCopy;

    const selectedComponent = getComponentTreeById(
      editorTree.root,
      selectedComponentId,
    ) as ComponentStructure;

    let targetId = selectedComponentId;
    const targetName = selectedComponent?.name!;

    if (!targetId || targetId === "root") return "content-wrapper";

    let componentIndex = 0;

    const isSpecialComponents = ["GridColumn", "Alert", "Accordion"].includes(
      clipboardContent.name,
    );
    const isGridItems = ["Grid", "GridColumn"].includes(componentToPaste.name);
    const isTargetGridItems = ["Grid", "GridColumn"].includes(targetName);
    const isTargetModalsOrDrawers = ["Modal", "Drawer"].includes(targetName);

    const isLayoutCategory =
      structureMapper[componentToPaste.name!]?.category === "Layout";
    const isAllowedGridMatch =
      isGridItems === isTargetGridItems && targetName === componentToPaste.name;
    const isAllowedSibling =
      isLayoutCategory && !isTargetGridItems && !isTargetModalsOrDrawers;

    const addAsSiblingFlag =
      selectedComponent?.blockDroppingChildrenInside ||
      isSpecialComponents ||
      isAllowedSibling ||
      isAllowedGridMatch;

    const editorTreeCopy = cloneObject(editorTree) as EditorTreeCopy;

    if (addAsSiblingFlag) {
      const parentComponentTree = getComponentParent(
        editorTreeCopy.root as ComponentStructure,
        selectedComponentId,
      );
      targetId = parentComponentTree?.id as string;
      componentIndex =
        getComponentIndex(parentComponentTree!, selectedComponentId!) + 1;
    } else {
      componentIndex = clipboardContent?.children?.length ?? 0;
    }

    const newSelectedId = addComponent(
      editorTreeCopy.root as ComponentStructure,
      clipboardContent,
      {
        id: targetId!,
        edge: isGridItems ? "center" : "top",
      },
      componentIndex,
      true,
    );

    setEditorTree(editorTreeCopy, {
      action: `Pasted ${clipboardContent.name}`,
    });
    setSelectedComponentIds(() => [newSelectedId]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [copiedComponent, setEditorTree]);

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
            title: "Copy (CTRL+C)",
            onClick: () => copyComponent(component),
          },
          {
            key: "paste",
            icon: <IconClipboardText size={16} />,
            title: "Paste (CTRL+V)",
            onClick: () => pasteComponent(),
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
            key: "reset",
            icon: <IconRefresh size={16} />,
            title: "Reset",
            onClick: () => resetComponent(component),
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

export const useComponentContextEventHandler = (component: Component) => {
  const { componentContextMenu } = useComponentContextMenu();

  return useCallback(
    (event: any) => {
      const isEditorMode = isEditorModeSelector(useEditorTreeStore.getState());
      if (event.shiftKey || event.ctrlKey || event.metaKey || !isEditorMode) {
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
