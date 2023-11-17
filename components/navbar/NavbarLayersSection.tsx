import { Icon } from "@/components/Icon";
import { useEditorStore } from "@/stores/editor";
import { structureMapper } from "@/utils/componentMapper";
import { ICON_SIZE, NAVBAR_WIDTH } from "@/utils/config";
import {
  Component,
  debouncedTreeComponentDescriptionpdate,
  debouncedTreeRootChildrenUpdate,
} from "@/utils/editor";
import {
  ActionIcon,
  Card,
  Group,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure, useHover } from "@mantine/hooks";
import { IconChevronDown, IconChevronRight } from "@tabler/icons-react";
import { KeyboardEvent, useEffect, useRef } from "react";
import Nestable from "react-nestable";

type ListItemProps = {
  component: Component;
  collapseIcon: any;
};

const ListItem = ({ component, collapseIcon }: ListItemProps) => {
  const theme = useMantineTheme();
  const { ref, hovered } = useHover();
  const currentTargetId = useEditorStore((state) => state.currentTargetId);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
  );
  const setSelectedComponentId = useEditorStore(
    (state) => state.setSelectedComponentId,
  );

  const [editable, { toggle: toggleEdit, close: closeEdit }] =
    useDisclosure(false);
  const editFieldRef = useRef<HTMLInputElement>(null);

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
    const isCurrentComponentSelected = component.id === selectedComponentId;
    const isRootOrContentWrapper =
      selectedComponentId === "root" ||
      selectedComponentId === "content-wrapper";

    if (!isCurrentComponentSelected || isRootOrContentWrapper) {
      return;
    }

    // Scroll the current component into view if it's not root or content-wrapper
    ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponentId]);

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
      style={{
        borderLeft: "1px solid transparent",
      }}
      sx={(theme) =>
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
        bg={hovered ? "gray.1" : undefined}
        style={{
          cursor: "move",
          border:
            selectedComponentId === component.id
              ? `1px solid ${theme.colors.teal[6]}`
              : undefined,
          display: "flex",
          position: "relative",
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleSelection(component.id as string);
        }}
        onDoubleClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleEdit();
        }}
        onBlur={closeEdit}
        onKeyDown={handleKeyPress}
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
                {component.id === "root" ? "Body" : "Content Wrapper"}
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
                  debouncedTreeComponentDescriptionpdate(e.target.value);
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

export const NavbarLayersSection = () => {
  const editorTree = useEditorStore((state) => state.tree);

  const isStructureCollapsed = useEditorStore(
    (state) => state.isStructureCollapsed,
  );

  // Render function for Nestable items
  const renderItem = ({ item, collapseIcon }: any): JSX.Element => {
    return (
      <ListItem
        collapseIcon={collapseIcon}
        component={item}
        key={`listItem-${item.id}`}
      />
    );
  };

  const items = editorTree.root.children;

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
