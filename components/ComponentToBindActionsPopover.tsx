import { IconExternalLink } from "@tabler/icons-react";
import { ICON_SIZE } from "@/utils/config";
import {
  Accordion,
  ActionIcon,
  Collapse,
  Flex,
  Group,
  List,
  Popover,
  Text,
} from "@mantine/core";
import { useEditorStore } from "@/stores/editor";
import { Component } from "@/utils/editor";
import { SortableTreeItem } from "@/components/SortableTreeItem";
import { structureMapper } from "@/utils/componentMapper";
import { useState } from "react";

interface IComponentToBindActionsPopover {
  onClick: (componentToBind: string) => void;
}

export const ComponentToBindActionsPopover = ({
  onClick,
}: IComponentToBindActionsPopover) => {
  return (
    <Popover width={200} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <ActionIcon>
          <IconExternalLink size={ICON_SIZE} />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown p={0}>
        <Accordion multiple defaultValue={["components"]}>
          <Accordion.Item value="components">
            <Accordion.Control>Components</Accordion.Control>
            <Accordion.Panel>
              <ListComponentToBindPopover onClick={onClick} />
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="pages">
            <Accordion.Control>Pages</Accordion.Control>
            <Accordion.Panel>Pages</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="global">
            <Accordion.Control>Global</Accordion.Control>
            <Accordion.Panel>Global</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Popover.Dropdown>
    </Popover>
  );
};

const ListItem = ({ component, children, level = 0 }: any) => {
  const [isClicked, setIsClicked] = useState(false);
  const {
    setHighlightedComponentId,
    setComponentToBind,
    selectedComponentId,
    setPickingComponentToBindTo,
  } = useEditorStore();

  const icon = structureMapper[component.name as string]?.icon;

  return (
    <Flex w="100%" pl={level > 1 ? 10 : 0} direction="column">
      <Flex
        w="100%"
        p={level > 1 ? 2 : 0}
        sx={(theme) => ({
          cursor: "pointer",
          "&:hover": { background: theme.colors.gray[1] },
        })}
      >
        <Group
          position="apart"
          noWrap
          w="100%"
          onClick={(e) => {
            e.stopPropagation();
            setHighlightedComponentId(component.id);
            setComponentToBind(component.id);
            setPickingComponentToBindTo({
              componentId: selectedComponentId!,
              trigger: "onClick",
              bindedId: selectedComponentId ?? "",
            });
            setIsClicked(true);
          }}
          onMouseEnter={(e) => {
            e.stopPropagation();
            setHighlightedComponentId(component.id);
            setIsClicked(false);
          }}
          onMouseLeave={(e) => {
            e.stopPropagation();
            if (!isClicked) {
              setHighlightedComponentId(null);
            }
          }}
        >
          <Group spacing={4} noWrap w="100%">
            {component.id !== "root" && component.id !== "content-wrapper" && (
              <>
                {icon}
                <Text id={`layer-${component.id}`} size="xs" lineClamp={1}>
                  {component.description}
                </Text>
              </>
            )}
          </Group>
        </Group>
      </Flex>
      <Collapse key={component.id} in>
        {children}
      </Collapse>
    </Flex>
  );
};

const ListItemWrapper = ({ component, children, level }: any) => {
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

const ListComponentToBindPopover = ({
  onClick,
}: IComponentToBindActionsPopover) => {
  const editorTree = useEditorStore((state) => state.tree);

  const renderList = (component: Component, level: number = 0) => {
    if (!component) {
      return null;
    }

    return (
      <ListItemWrapper key={component.id} component={component} level={level}>
        {component.children?.map((child) => {
          return renderList(child, level + 1);
        })}
      </ListItemWrapper>
    );
  };

  return (
    <List
      size="xs"
      listStyleType="none"
      sx={{ padding: 0, marginTop: -20 }}
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
