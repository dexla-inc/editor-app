import { ActionIconTransparent } from "@/components/ActionIconTransparent";
import { useDraggable } from "@/hooks/useDraggable";
import { useOnDragStart } from "@/hooks/useOnDragStart";
import { useEditorStore } from "@/stores/editor";
import { theme } from "@/utils/branding";
import { structureMapper } from "@/utils/componentMapper";
import { ICON_DELETE, ICON_SIZE } from "@/utils/config";
import {
  addComponent,
  getComponentById,
  getComponentIndex,
  getComponentParent,
  removeComponent,
  removeComponentFromParent,
} from "@/utils/editor";
import { Group, Text, Tooltip, UnstyledButton } from "@mantine/core";
import { IconGripVertical } from "@tabler/icons-react";
import cloneDeep from "lodash.clonedeep";
import { useCallback, useEffect, useMemo } from "react";

type Props = {
  customComponentModal: any;
};

export const ComponentToolbox = ({ customComponentModal }: Props) => {
  const isResizing = useEditorStore((state) => state.isResizing);
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);
  const iframeWindow = useEditorStore((state) => state.iframeWindow);
  const editorTheme = useEditorStore((state) => state.theme);
  const editorTree = useEditorStore((state) => state.tree);
  const setEditorTree = useEditorStore((state) => state.setTree);
  const setSelectedComponentId = useEditorStore(
    (state) => state.setSelectedComponentId,
  );
  const setSelectedComponentIds = useEditorStore(
    (state) => state.setSelectedComponentIds,
  );
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
  );

  const component = getComponentById(editorTree.root, selectedComponentId!);

  const id = component?.id;
  const isGrid = component?.name === "Grid";
  const isColumn = component?.name === "GridColumn";

  const parent = useMemo(
    () => (id ? getComponentParent(editorTree.root, id) : null),
    [editorTree.root, id],
  );

  const onDragStart = useOnDragStart();

  const draggable = useDraggable({
    id: id || "",
    onDragStart,
    currentWindow: iframeWindow,
  });

  const calculatePosition = useCallback(() => {
    if (component?.id && !isPreviewMode) {
      const canvas = document.getElementById("iframe-canvas");
      const toolbox = document.getElementById("toolbox");
      const comp = iframeWindow?.document.getElementById(component.id);

      if (toolbox && comp && canvas) {
        const canvasRect = canvas.getBoundingClientRect();
        const toolboxRect = toolbox.getBoundingClientRect();
        const compRect = comp.getBoundingClientRect();

        toolbox.style.top = `${
          canvasRect.top + compRect.top - toolboxRect.height
        }px`;
        toolbox.style.left = `${canvasRect.left + compRect.left}px`;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    component?.id,
    iframeWindow?.document,
    isPreviewMode,
    editorTree.timestamp,
  ]);

  useEffect(() => {
    calculatePosition();
  }, [calculatePosition]);

  useEffect(() => {
    const el = iframeWindow?.document.querySelector(
      ".iframe-canvas-ScrollArea-viewport",
    );
    el?.addEventListener("scroll", calculatePosition);
    return () => el?.removeEventListener("scroll", calculatePosition);
  }, [calculatePosition, iframeWindow]);

  if (!component || isPreviewMode || !id || isResizing) {
    return null;
  }

  const ColumnSchema = structureMapper["GridColumn"].structure({});
  const GridSchema = structureMapper["Grid"].structure({});

  const haveNonRootParent = parent && parent.id !== "root";

  if (!selectedComponentId || !component) {
    return null;
  }

  return (
    <Group
      id="toolbox"
      px={4}
      h={24}
      noWrap
      spacing={2}
      top={-24}
      left={0}
      pos="absolute"
      style={{ zIndex: 200 }}
      bg={theme.colors.teal[6]}
      sx={(theme) => ({
        borderTopLeftRadius: theme.radius.sm,
        borderTopRightRadius: theme.radius.sm,
      })}
    >
      {!component.fixedPosition && (
        <Tooltip label="Move" fz="xs">
          <UnstyledButton
            sx={{
              cursor: isColumn ? "default" : "move",
              alignItems: "center",
              display: "flex",
            }}
            {...(isColumn ? {} : draggable)}
          >
            {component.name !== "GridColumn" && (
              <IconGripVertical
                size={ICON_SIZE}
                color="white"
                strokeWidth={1.5}
              />
            )}
          </UnstyledButton>
        </Tooltip>
      )}
      <Text color="white" size="xs" pr={haveNonRootParent ? 8 : "xs"}>
        {(component.description || "").length > 20
          ? `${component.description?.substring(0, 20)}...`
          : component.description}
      </Text>
      {haveNonRootParent && (
        <ActionIconTransparent
          iconName="IconArrowUp"
          tooltip="Go up"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setSelectedComponentId(parent.id as string);
            setSelectedComponentIds(() => [parent.id!]);
          }}
        />
      )}
      {!isGrid && !isColumn && (
        <ActionIconTransparent
          iconName="IconBoxMargin"
          tooltip="Wrap container"
          onClick={() => {
            const container = structureMapper["Container"].structure({
              theme: editorTheme,
            });

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
              getComponentIndex(parent!, id),
            );

            addComponent(copy.root, component, {
              id: containerId,
              edge: "left",
            });

            removeComponentFromParent(copy.root, id, parent?.id!);
            setEditorTree(copy, {
              action: `Wrapped ${component.name} with a Container`,
            });
          }}
        />
      )}
      {isGrid && (
        <>
          <ActionIconTransparent
            iconName="IconColumnInsertRight"
            tooltip="Add column"
            onClick={() => {
              const copy = cloneDeep(editorTree);
              addComponent(
                copy.root,
                {
                  ...ColumnSchema,
                  props: { ...ColumnSchema.props, resetTargetResized: true },
                },
                {
                  id: component.id!,
                  edge: "center",
                },
              );

              setEditorTree(copy);
            }}
          />

          <ActionIconTransparent
            iconName="IconRowInsertBottom"
            tooltip="Insert row"
            onClick={() => {
              const copy = cloneDeep(editorTree);
              addComponent(
                copy.root,
                // @ts-ignore
                { ...GridSchema, children: [ColumnSchema] },
                {
                  id: parent?.id!,
                  edge: "center",
                },
              );

              setEditorTree(copy);
            }}
          />
        </>
      )}
      {isColumn && (
        <>
          <ActionIconTransparent
            iconName="IconLayoutColumns"
            tooltip="Split columns"
            onClick={() => {
              const copy = cloneDeep(editorTree);
              addComponent(copy.root, GridSchema, {
                id: component.id!,
                edge: "center",
              });

              setEditorTree(copy);
            }}
          />

          <ActionIconTransparent
            iconName="IconRowInsertBottom"
            tooltip="Insert row"
            onClick={() => {
              const copy = cloneDeep(editorTree);
              addComponent(
                copy.root,
                // @ts-ignore
                { ...GridSchema, children: [ColumnSchema] },
                {
                  id: component?.id!,
                  edge: "center",
                },
              );

              setEditorTree(copy);
            }}
          />
        </>
      )}
      <ActionIconTransparent
        iconName={ICON_DELETE}
        tooltip="Delete"
        onClick={() => {
          const copy = cloneDeep(editorTree);
          removeComponent(copy.root, component?.id!);
          setEditorTree(copy, { action: `Removed ${component?.name}` });
        }}
      />
      {customComponentModal && (
        <ActionIconTransparent
          iconName="IconDeviceFloppy"
          tooltip="Save as custom component"
          onClick={() => {
            customComponentModal.open();
          }}
        />
      )}
    </Group>
  );
};
