import { Icon } from "@/components/Icon";
import { useComponentContextMenu } from "@/hooks/useComponentContextMenu";
import { useEditorStore } from "@/stores/editor";
import { HOVERED, SELECTED } from "@/utils/branding";
import { structureMapper } from "@/utils/componentMapper";
import { ICON_SIZE, NAVBAR_WIDTH } from "@/utils/config";
import {
  Component,
  debouncedTreeComponentAttrsUpdate,
  debouncedTreeRootChildrenUpdate,
} from "@/utils/editor";
import { ActionIcon, Card, Group, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure, useHover } from "@mantine/hooks";
import { IconChevronDown, IconChevronRight } from "@tabler/icons-react";
import { KeyboardEvent, useEffect, useMemo, useRef } from "react";
import Nestable from "react-nestable";

type ListItemProps = {
  component: Component;
  collapseIcon: any;
  isSelected: boolean;
};

const ListItem = ({ component, collapseIcon, isSelected }: ListItemProps) => {
  const { ref, hovered } = useHover();
  const currentTargetId = useEditorStore((state) => state.currentTargetId);
  const setSelectedComponentId = useEditorStore(
    (state) => state.setSelectedComponentId,
  );

  const [editable, { toggle: toggleEdit, close: closeEdit }] =
    useDisclosure(false);
  const editFieldRef = useRef<HTMLInputElement>(null);

  const { componentContextMenu, forceDestroyContextMenu } =
    useComponentContextMenu();

  const form = useForm({
    initialValues: {
      value: component.description,
    },
  });

  const handleSelection = (id: string) => {
    if (id !== "root") {
      setSelectedComponentId(id as string);
    }
  };

  const isCurrentTarget = currentTargetId === `layer-${component.id}`;

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "Escape") closeEdit();
  };

  useEffect(() => {
    if (isSelected) {
      // Scroll the current component into view if it's not root or content-wrapper
      ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSelected]);

  useEffect(() => {
    if (editable) {
      editFieldRef?.current?.focus();
    }
  }, [editable]);

  const icon = structureMapper[component.name as string]?.icon;
  const componentActions = component.actions;

  return (
    <Group
      unstyled
      w="100%"
      {...(isCurrentTarget && { className: "is-drag-over" })}
      sx={() =>
        component.id !== "root"
          ? {
              padding: "0 0 0 10px",
            }
          : {}
      }
    >
      <Card
        ref={ref}
        w="100%"
        p={2}
        bg={hovered ? HOVERED : undefined}
        style={{
          cursor: "move",
          border: isSelected ? SELECTED : undefined,
          display: "flex",
          position: "relative",
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          forceDestroyContextMenu();
          handleSelection(component.id as string);
        }}
        onDoubleClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleEdit();
        }}
        onBlur={closeEdit}
        onKeyDown={handleKeyPress}
        onContextMenu={componentContextMenu(component)}
      >
        <Group position="apart" noWrap w="100%">
          <Group
            spacing={4}
            noWrap
            w="100%"
            align="center"
            sx={{ backgroundColor: `${editable && "white"}` }}
          >
            <ActionIcon
              variant="transparent"
              sx={{ cursor: "pointer", pointerEvents: "all" }}
            >
              {collapseIcon}
            </ActionIcon>
            {component.id !== "root" && icon}
            {component.id === "root" || component.id === "content-wrapper" ? (
              <Text
                id={`layer-${component.id}`}
                size="xs"
                lineClamp={1}
                sx={{ cursor: "move", width: "100%" }}
              >
                Body
              </Text>
            ) : editable ? (
              <TextInput
                ref={editFieldRef}
                id={`layer-${component.id}`}
                size="xs"
                w="100%"
                variant="unstyled"
                {...form.getInputProps("value")}
                onChange={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.setFieldValue("value", e.target.value);
                  debouncedTreeComponentAttrsUpdate({
                    description: e.target.value,
                  });
                }}
              />
            ) : (
              <Text
                id={`layer-${component.id}`}
                size="xs"
                lineClamp={1}
                sx={{ cursor: "move", width: "100%" }}
              >
                {component.description}
              </Text>
            )}
          </Group>
        </Group>
        {componentActions && !!componentActions.length && (
          <ActionIcon color="teal" variant="transparent" size={30}>
            <Icon name="IconBolt" size={ICON_SIZE} />
          </ActionIcon>
        )}
        {component.props?.style?.display === "none" && (
          <ActionIcon color="dark" variant="transparent" size={30}>
            <Icon name="IconEyeOff" size={ICON_SIZE} />
          </ActionIcon>
        )}
      </Card>
    </Group>
  );
};

const Collapser = ({ isCollapsed }: { isCollapsed: boolean }) => {
  return isCollapsed ? (
    <IconChevronRight size={ICON_SIZE} />
  ) : (
    <IconChevronDown size={ICON_SIZE} />
  );
};

const RenderItemInner = ({ item, collapseIcon }: any) => {
  const isSelected = useEditorStore(
    (state) => state.selectedComponentId === item.id,
  );
  return (
    <ListItem
      isSelected={isSelected}
      collapseIcon={collapseIcon}
      component={item}
      key={`listItem-${item.id}`}
    />
  );
};

export const EditorNavbarLayersSection = () => {
  const editorTree = useEditorStore((state) => state.tree);

  const isStructureCollapsed = useEditorStore(
    (state) => state.isStructureCollapsed,
  );

  // Render function for Nestable items
  const renderItem = ({ item, collapseIcon }: any): JSX.Element => {
    return <RenderItemInner item={item} collapseIcon={collapseIcon} />;
  };

  const items = useMemo(
    () => editorTree.root.children,
    [editorTree.root.children],
  );

  const handleChange = (items: any) => {
    debouncedTreeRootChildrenUpdate(items.items);
  };

  return (
    <Nestable
      items={items}
      renderItem={renderItem}
      onChange={handleChange}
      renderCollapseIcon={({ isCollapsed }) => (
        <Collapser isCollapsed={isCollapsed} />
      )}
      maxDepth={NAVBAR_WIDTH}
      collapsed={isStructureCollapsed}
    />
  );
};
