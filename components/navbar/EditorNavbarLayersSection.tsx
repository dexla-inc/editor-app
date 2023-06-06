import { useEditorStore } from "@/stores/editor";
import { ICON_SIZE } from "@/utils/config";
import { Component, removeComponent } from "@/utils/editor";
import {
  ActionIcon,
  Card,
  CardProps,
  Collapse,
  Group,
  List,
  Text,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconChevronDown,
  IconGripVertical,
  IconTrash,
} from "@tabler/icons-react";

type ListItemProps = {
  component: Component;
} & CardProps;

const ListItem = ({ component, children }: ListItemProps) => {
  const theme = useMantineTheme();
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );
  const setSelectedComponentId = useEditorStore(
    (state) => state.setSelectedComponentId
  );
  const setEditorTree = useEditorStore((state) => state.setTree);
  const clearSelection = useEditorStore((state) => state.clearSelection);
  const [opened, { toggle }] = useDisclosure(false);

  const handleSelection = (e: React.MouseEvent<HTMLElement>, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (id !== "root") {
      setSelectedComponentId(id as string);
    }
  };

  return (
    <>
      <Card
        withBorder
        radius="xs"
        p="xs"
        w="100%"
        style={{
          cursor: "pointer",
          borderColor:
            selectedComponentId === component.id
              ? theme.colors.teal[6]
              : undefined,
        }}
        onClick={(e) => handleSelection(e, component.id as string)}
      >
        <Group position="apart" noWrap>
          <Group spacing={4} noWrap>
            {component.id !== "root" && (
              <UnstyledButton
                sx={{ cursor: "grab", alignItems: "center", display: "flex" }}
              >
                <IconGripVertical size={ICON_SIZE} strokeWidth={1.5} />
              </UnstyledButton>
            )}
            {(component.children ?? [])?.length > 0 && (
              <ActionIcon
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggle();
                }}
              >
                <IconChevronDown
                  size={ICON_SIZE}
                  style={{
                    transition: "transform 200ms ease",
                    transform: opened ? `rotate(-180deg)` : "none",
                  }}
                />
              </ActionIcon>
            )}
            <Text size="xs" lineClamp={1} sx={{ cursor: "pointer" }}>
              {component.id === "root" ? "Root" : component.name}
            </Text>
          </Group>

          {component.id !== "root" && (
            <ActionIcon
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const copy = { ...editorTree };

                if (component.id === selectedComponentId) {
                  clearSelection();
                }

                removeComponent(editorTree.root, component.id as string);
                setEditorTree(copy);
              }}
            >
              <IconTrash size={ICON_SIZE} strokeWidth={1.5} />
            </ActionIcon>
          )}
        </Group>
      </Card>
      <Collapse in={opened}>{children}</Collapse>
    </>
  );
};

export const EditorNavbarLayersSection = () => {
  const editorTree = useEditorStore((state) => state.tree);

  const renderList = (component: Component) => {
    return (
      <List.Item>
        <ListItem component={component}>
          <List
            size="xs"
            withPadding
            listStyleType="none"
            styles={{
              itemWrapper: {
                width: "100%",
              },
            }}
          >
            {component.children?.map((child) => {
              return (
                <List.Item key={child.id}>
                  <ListItem component={child}>
                    {(child.children ?? [])?.length > 0 && (
                      <List
                        size="xs"
                        withPadding
                        listStyleType="none"
                        styles={{
                          itemWrapper: {
                            width: "100%",
                          },
                        }}
                      >
                        {child.children?.map(renderList)}
                      </List>
                    )}
                  </ListItem>
                </List.Item>
              );
            })}
          </List>
        </ListItem>
      </List.Item>
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
      {renderList(editorTree.root)}
    </List>
  );
};
