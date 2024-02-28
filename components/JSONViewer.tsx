import { ObjectItem, objToItems } from "@/utils/common";
import {
  ActionIcon,
  Card,
  Collapse,
  Flex,
  Group,
  List,
  ScrollArea,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown } from "@tabler/icons-react";

type Props = {
  data?: any;
};

export const JSONViewer = ({ data }: Props) => {
  const items = objToItems(data, data);

  const renderList = (items: any) => (
    <List size="xs" listStyleType="none">
      {items.map((item: any, index: number) => (
        <List.Item key={index}>
          <ListItem item={item} />
        </List.Item>
      ))}
    </List>
  );

  return (
    <ScrollArea.Autosize mah={150}>
      <Card p="xs">{renderList(items)}</Card>
    </ScrollArea.Autosize>
  );
};

type ListItemProps = {
  item: ObjectItem;
};

const ListItem = ({ item }: ListItemProps) => {
  const [opened, { toggle }] = useDisclosure(false);
  const canExpand = item.children && item.children.length > 0;

  return (
    <Group
      unstyled
      style={{
        borderLeft: "1px solid transparent",
        cursor: "pointer",
      }}
    >
      <Card
        p={0}
        onClick={toggle}
        sx={{
          display: "flex",
          position: "relative",
          width: "100%",
        }}
      >
        <Group position="apart" noWrap style={{ width: "100%" }}>
          <Group spacing={4} noWrap style={{ width: "100%" }}>
            <ActionIcon
              style={{
                visibility: canExpand ? "visible" : "hidden",
              }}
            >
              <IconChevronDown
                size={20}
                style={{
                  transition: "transform 200ms ease",
                  transform: opened ? "rotate(0deg)" : "rotate(-90deg)",
                }}
              />
            </ActionIcon>
            <Text>
              {canExpand ? (
                <Text color="#abd4f8">{item.key}</Text>
              ) : (
                <Flex gap={2}>
                  <Text color="#abd4f8">{item.key}:</Text>
                  <Text color="#f0a1a0">{item.value}</Text>
                </Flex>
              )}
            </Text>
          </Group>
        </Group>
      </Card>
      <Collapse in={opened}>
        <List size="xs" listStyleType="none">
          {item.children?.map((child, index) => (
            <List.Item key={index}>
              <ListItem item={child} />
            </List.Item>
          ))}
        </List>
      </Collapse>
    </Group>
  );
};
