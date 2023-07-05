import { SortableTreeItem } from "@/components/SortableTreeItem";
import { useDraggable } from "@/hooks/useDraggable";
import { useOnDragStart } from "@/hooks/useOnDragStart";
import { useEditorStore } from "@/stores/editor";
import { structureMapper } from "@/utils/componentMapper";
import { ICON_SIZE } from "@/utils/config";
import { Component } from "@/utils/editor";
import {
  ActionIcon,
  Card,
  CardProps,
  Collapse,
  Group,
  List,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown } from "@tabler/icons-react";

type ListItemProps = {
  component: Component;
  level: number;
} & CardProps;

const ListItem = ({ component, children, level }: ListItemProps) => {
  const theme = useMantineTheme();
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );
  const setSelectedComponentId = useEditorStore(
    (state) => state.setSelectedComponentId
  );
  const [opened, { toggle }] = useDisclosure(component.id === "root");

  const onDragStart = useOnDragStart();

  const draggable = useDraggable({
    id: `layer-${component.id}`,
    onDragStart,
  });

  const handleSelection = (e: React.MouseEvent<HTMLElement>, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (id !== "root") {
      setSelectedComponentId(id as string);
    }
  };

  const icon = structureMapper[component.name as string]?.icon;

  const canExpand = (component.children ?? [])?.length > 0;
  const paddingLeft = canExpand ? `${level * 20}px` : `${level * 35}px`;

  return (
    <>
      <Card
        p={0}
        w="100%"
        style={{
          cursor: "move",
          border:
            selectedComponentId === component.id
              ? `1px solid ${theme.colors.teal[6]}`
              : undefined,
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleSelection(e, component.id as string);
        }}
      >
        <Group
          position="apart"
          noWrap
          sx={{
            backgroundColor:
              selectedComponentId === component.id
                ? theme.colors.gray[1]
                : undefined,
            "&:hover": {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[6]
                  : theme.colors.gray[1],
            },
          }}
        >
          <Group spacing={4} noWrap w="100%" pl={paddingLeft}>
            <ActionIcon
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggle();
              }}
              sx={{
                visibility: canExpand ? "visible" : "hidden",
                pointerEvents: canExpand ? "all" : "none",
                width: canExpand ? "auto" : 0,
                minWidth: canExpand ? "auto" : 0,
                cursor: "pointer",
              }}
            >
              <IconChevronDown
                size={ICON_SIZE}
                style={{
                  transition: "transform 200ms ease",
                  transform: opened ? `none` : "rotate(-90deg)",
                }}
              />
            </ActionIcon>
            {component.id !== "root" && icon}
            <Text
              id={`layer-${component.id}`}
              size="xs"
              lineClamp={1}
              sx={{ cursor: "move", width: "100%" }}
              {...draggable}
            >
              {component.id === "root" ? "Body" : component.name}
            </Text>
          </Group>
        </Group>
      </Card>
      <Collapse in={opened}>{children}</Collapse>
    </>
  );
};

const ListItemWrapper = ({ component, children, level }: ListItemProps) => {
  return (
    <SortableTreeItem component={component}>
      <List.Item key={component.id} w="100%">
        <ListItem component={component} level={level}>
          {(component.children ?? [])?.length > 0 && (
            <List
              size="xs"
              listStyleType="none"
              styles={{
                itemWrapper: {
                  width: "100%",
                },
              }}
            >
              {children}
            </List>
          )}
        </ListItem>
      </List.Item>
    </SortableTreeItem>
  );
};

export const EditorNavbarLayersSection = () => {
  const editorTree = useEditorStore((state) => state.tree);

  const renderList = (component: Component, level: number) => {
    if (!component) {
      return null;
    }

    level = component.id !== "root" ? level + 1 : level;

    return (
      <ListItemWrapper key={component.id} component={component} level={level}>
        {component.children?.map((child) => {
          return (
            <ListItemWrapper key={child.id} component={child} level={level}>
              <ListItem component={child} level={level}>
                {child.children?.map((child) => renderList(child, level))}
              </ListItem>
            </ListItemWrapper>
          );
        })}
      </ListItemWrapper>
    );
  };

  return (
    <List
      size="xs"
      listStyleType="none"
      styles={{
        itemWrapper: {
          width: "100%",
        },
      }}
    >
      {renderList(editorTree.root, 0)}
    </List>
  );
};
